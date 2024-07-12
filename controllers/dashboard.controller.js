const Users = require('../models/Users');
const errorHandler = require('../utils/errorHandler');
const axios = require('axios');
const { getAllNigerianBanks } = require('../helpers/getNigerianBanks');
const User = require('../models/Users');

const getSingleUserDetail = async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await Users.findById(_id);

        if (!user){
            res.status(404).json({message: 'no user found with this id'});
            return;
        }
        const { firstname, lastname, email, phone, fundraisers } = user;

        let data = {
            firstname,
            lastname,
            email,
            phone,
            fundraisers
        }

        res.status(200).json(data);
    } catch (error) {
    errorHandler(error, res);
  }
}

const getCurrentUserFundraisers = async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await Users.findById(_id);

        if (!user){
            res.status(404).json({message: 'no user found with this id'});
            return;
        }
        
        const populatedFundraisers = await user.getPopulatedFundraisers();

        if (!populatedFundraisers){
            return res.status(404).json({message: "user has no fundraisers"});
        }

        res.status(200).json(populatedFundraisers);
    } catch (error) {
    errorHandler(error, res);
  }
}

const updateUserDetails = async (req, res) => {
    const { _id } = req.user;
    try {
        let user = await Users.findById(_id);

        const { firstName, lastName, phoneNumber } = req.body;

        if (!firstName && !lastName && !phoneNumber) {
            res.status(400).json({ message: 'At least one field must be provided' });
            return;
        }

        if (firstName) user.firstname = firstName;
        if (lastName) user.lastname = lastName;
        if (phoneNumber) user.phone = phoneNumber;

        await user.save();

        user = user.toObject();
        delete user.token

        res.status(200).json({ message: 'User details updated successfully', user });

        if (!user){
            res.status(404).json({message: 'no user found with this id'});
            return;
        }
        

        res.status(200).json(populatedFundraisers);
    } catch (error) {
    errorHandler(error, res);
  }
}

const getAllBanks = async (req, res) => {
    try {
        let response = await getAllNigerianBanks();

        if (response) {
            res.status(200).json({ message: 'successfully', data: response });
            return;
        } else {
            res.status(404).json({ message: 'unsuccessfully', data: response });
            return;
        }
    } catch (error){
        errorHandler(error, res);
    }
}

const authenticateUserBankDetails = async (userId, payloadFromPaystack, account_details) => {
    const { account_name } = payloadFromPaystack;
    const nameParts = account_name.split(" ");
    
    const firstName = nameParts[0];
    // const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
    const lastName = nameParts[nameParts.length - 1];

    const fullnameFromPayload = `${firstName} ${lastName}`.toLowerCase();

    const user = await Users.findById(userId);
    const { firstname, lastname } = user;

    const fullnameFromDb = `${firstname} ${lastname}`.toLowerCase();

    if (fullnameFromDb !== fullnameFromPayload) {
        return { error: true, message: "Account name does not match user details" };
    }

    user.accountDetails(account_details);
    await user.save();

    return { error: false, message: "Account details updated" };
}

const addBankdetailsToUser = async (req, res) => {
    const { _id } = req.user;
    try {
        const { accountNumber, bankName, bankCode} = req.body;

        if (!accountNumber || !bankCode ){
            res.status(400).json({ message: 'account number or bank code is invalid' });
            return;
        }

        const response = await axios(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            headers: {
                "Authorization" : `Bearer ${process.env.PAYSTACK_SK_TEST_KEY}`
            }
        });


        let account_details;

        if (response.data.status) {
            account_details = {
                accountNumber: response.account_number,
                accountName: response.account_name,
                bankCode: bankCode,
                bankName: bankName
            };
            let reply = await authenticateUserBankDetails(_id, response.data.data, account_details)

            if (!reply.error) {
                res.status(200).json(reply);
                return;
            } else {
                res.status(422).json(reply);
                return;
            }
        } else {
            res.status(400).json({ message: "Invalid request"})
        }
    } catch (error) {
        errorHandler(error, res);
    }
}

const removeBankDetailsFromUser = async (req, res) => {
    const { _id } = req.user;
    try {
        /* const { accountNumber } = req.params;

        if (!accountNumber) {
            res.status(400).json({ message : "Invalid account number" });
            return;
        } */

        const user = await User.findById(_id);

        if (!user) {
            res.status(400).json({ message: "User not found"});
            return;
        }

        delete user.accountDetails;
        await user.save();

        res.status(204).json({ message: "Account details removed successfully" });
    } catch (error) {
        errorHandler(error, res);
    }
}

module.exports = {
    getSingleUserDetail,
    getCurrentUserFundraisers,
    updateUserDetails,
    getAllBanks,
    addBankdetailsToUser,
    removeBankDetailsFromUser
}