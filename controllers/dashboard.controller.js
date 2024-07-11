const Users = require('../models/Users');
const errorHandler = require('../utils/errorHandler');

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
        delete user.tokens;

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

module.exports = {
    getSingleUserDetail,
    getCurrentUserFundraisers,
    updateUserDetails
}