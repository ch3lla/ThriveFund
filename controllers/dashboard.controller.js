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
        const { firstname, lastname, email, fundraisers } = user;

        let data = {
            firstname,
            lastname,
            email,
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

        console.log(populatedFundraisers);

        if (!populatedFundraisers){
            return res.status(404).json({message: "user has no fundraisers"});
        }

        res.status(200).json(populatedFundraisers);
    } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = {
    getSingleUserDetail,
    getCurrentUserFundraisers
}