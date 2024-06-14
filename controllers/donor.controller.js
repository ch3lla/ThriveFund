const Donor = require('../models/Donors');
const errorHandler = require('../utils/errorHandler');

const getAlDonors = async () => {
    try {
        const donors = await Donor.find();

        if (!donors){
            return res.status(200).json({});
        }

        res.status(200).json(donors);
    } catch(error){
        errorHandler(error, res);
    }
}

const getDonorsByFundraiserId = async () => {
    const { id } = req.params;
    try {
        if (!id){
            return res.status(400).json({message: "No id"});
        }

        const donors = Donor.find({_id: id});

        if (!donors){
            return res.status(200).json({message: "No donors for this campaign", data: donors});
        }

        res.status(200).json({messge: "successful", data: donors});
    } catch(error){
        errorHandler(error, res);
    }
}

module.exports = { getAlDonors, getDonorsByFundraiserId }