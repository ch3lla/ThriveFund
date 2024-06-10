// const stripe = require('stripe')('sk_test_51NZyZpAS9xMcoE3tYOUUpt9RC8Ptr7xCiUcMRRS76DMJuWu62Gxqscw4zacP6mSDjB8PoBt1P86rLt7Rd7Y1oqXP00icWb1BjS');

const Stripe = require('stripe');
const User = require('../models/Users');
const errorHandler = require('../utils/errorHandler');
const Donor = require('../models/Donors');
const Applicant = require('../models/Applicants');


const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SK_TEST_KEY);
  try {
    const { fundraiserId, amount, name, email, anonymity } = req.body;

    const metadata = {
      anonymity: anonymity ? 'anonymous' : 'known',
      donor_name: name || '',
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
              const id =  event.data.object.metadata['x-fundraiser-id'];
              await saveTransactionDetails(paymentIntent);
              let response = await Applicant.findByIdAndUpdate(id, {$inc: { amountRaised: parseFloat(payload.bill), donations: 1  }}, {new: true});
              if (response){
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

const saveTransactionDetails = async (paymentIntent) => {
  await Donor.create({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      donorName: paymentIntent.metadata.donor_name,
      donorEmail: paymentIntent.metadata.donor_email,
      anonymity: paymentIntent.metadata.anonymity,
  });
};

module.exports = { createPaymentIntent, webhook }