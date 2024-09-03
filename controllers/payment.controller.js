const Stripe = require('stripe');
const axios = require('axios');
const errorHandler = require('../utils/errorHandler');
const Donor = require('../models/Donors');
const Fundraisers = require('../models/Fundraisers');
const { notifySocketAfterSuccessfulPayment } = require('../helpers/socket');


const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SK_TEST_KEY);
  try {
    const { fundraiserId, amount, fullname, email, anonymity } = req.body;

    const metadata = {
      anonymity: anonymity ? 'anonymous' : 'known',
      donor_name: fullname || '',
      donor_email: email || '',
      fundraiserId: fundraiserId
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to smallest currency unit, e.g., cents
      currency: 'ngn',
      metadata: metadata,
      // Optionally, add customer information if needed
      receipt_email: email,
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch(error){
    errorHandler(error, res);
  }
}

const webhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SK_TEST_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.ENDPOINT_SECRET;

    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object;
              const id =  event.data.object.metadata['fundraiserId'];
              const amountPaid = event.data.object.amount_received;
              await saveTransactionDetails(paymentIntent, id);
              let response = await Fundraisers.findByIdAndUpdate(id, {$inc: { amountRaised: parseFloat(amountPaid / 100), donations: 1  }}, {new: true});
              if (response){
                notifySocketAfterSuccessfulPayment(id, response.amountRaised, paymentIntent.metadata.donor_name, paymentIntent.amount, paymentIntent.metadata.anonymity);
                return res.status(200).json({ error: "false", message: "successful", data: response});
              } else {
                return res.status(401).json({ error: "true", message: "unsuccessful"});
              }
            case 'payment_intent.payment_failed':
                const paymentIntentFailed = event.data.object;
                // Handle failed payment
                break;
            default:
                throw new Error(`Unhandled event type: ${event.type}.`);
          }

        res.status(200).json("successful");
    } catch (error) {
        errorHandler(error, res);
    }
};

const saveTransactionDetails = async (paymentIntent, id) => {
  await Donor.create({
      paymentIntentId: paymentIntent.id,
      fundraiserId: id,
      amount: parseFloat(paymentIntent.amount / 100),
      currency: paymentIntent.currency,
      donorName: paymentIntent.metadata.donor_name,
      donorEmail: paymentIntent.metadata.donor_email,
      anonymity: paymentIntent.metadata.anonymity,
  });
};


const initializeTranscation = async (req, res) => {
  try {
    const { fundraiserId, amount, fullname, email, anonymity } = req.body;

    const metadata = {
      anonymity: anonymity ? 'anonymous' : 'known',
      donor_name: fullname || '',
      donor_email: email || '',
      fundraiserId: fundraiserId
    };

    const paystackUrl = 'https://api.paystack.co/transaction/initialize';

    const params =  {
      "email": email,
      "amount": amount * 100,
      "currency": 'NGN',
      "metadata": metadata,
      "callback_url": `${process.env.FRONTEND_LOCAL_URL_2}/`
    };

    const { data } = await axios.post(paystackUrl, params,
      {
        headers: {
          "Authorization" : `Bearer ${process.env.PAYSTACK_SK_TEST_KEY}`
        }
      }
    );

    if (data.status) {
      res.status(200).send({
        authorizationUrl: data.data.authorization_url,
      });
    } else {
      res.status(400).json({ message: 'Something went wrong'});
      return;
    }

  } catch(error){
    errorHandler(error, res);
  }
}

const paystackwebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SK_TEST_KEY;
  try {
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
      const eventData = req.body;
      switch (eventData.event) {
        case 'paymentrequest.success':
          const paymentIntent = eventData.data;
          const id =  eventData.data.metadata['fundraiserId'];
          const amountPaid = eventData.data.amount;
          await saveTransactionDetails(paymentIntent, id);
          let response = await Fundraisers.findByIdAndUpdate(id, {$inc: { amountRaised: parseFloat(amountPaid / 100), donations: 1  }}, {new: true});
          if (response){
           // notifySocketAfterSuccessfulPayment(id, response.amountRaised, paymentIntent.metadata.donor_name, paymentIntent.amount, paymentIntent.metadata.anonymity);
            return res.status(200).json({ error: "false", message: "successful", data: response});
          } else {
            return res.status(401).json({ error: "true", message: "unsuccessful"});
          }
        case 'invoice.payment_failed':
            const paymentIntentFailed = eventData.data;
            // Handle failed payment
            break;
        default:
            throw new Error(`Unhandled eventData type: ${eventData.type}.`);
      }
      res.send(200).json("successful");
    } else {
      res.send(400).json("request is not from paystack");
    }
    
  } catch (error) {
        errorHandler(error, res);
  }
}
module.exports = { createPaymentIntent, webhook, initializeTranscation, paystackwebhook }