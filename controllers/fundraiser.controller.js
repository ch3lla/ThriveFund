const { request, response } = require('express');
const Fundraiser = require('../models/Fundraisers');
const errorHandler = require('../utils/errorHandler');

const addFundRaisingDetails = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    res.status(401).json({ message: 'Invalid token' });
  }

  try {

      const {
        firstname,
        lastname,
        email,
        phone,
        address,
        fundraiserTitle,
        fundraiserDescription,
        goal,
        category,
        deadline,
      } = req.body;

      const fundingMedia =
        {
          name: req.body.name,
          pathToFile: req.body.pathToFile,
          publicId: req.body.publicId
        };

      const newFundraiser = new Fundraiser({
        userId: _id,
        firstname,
        lastname,
        email,
        phone,
        address,
        fundraiserTitle,
        fundraiserDescription,
        goal,
        category,
        deadline,
        fundingMedia,
      });

      await newFundraiser.save();
      res.status(201).json({ message: 'Fundraiser details and files saved successfully!' });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getFundraiserDetailsByCategory = async (req, res) => {
  try {
    let { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: 'Category cannot be null'});
    }

    const FundraiserDetails = await Fundraiser.find({ category });

    if (!FundraiserDetails || FundraiserDetails.length === 0) {
      return res.status(404).json({ message: 'No Fundraiser found for this category' });
    }

    res.status(200).json(FundraiserDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

const getFundraiserDetailsById = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'ID cannot be null'});
    }

    const FundraiserDetails = await Fundraiser.findById(id);

    if (!FundraiserDetails || FundraiserDetails.length === 0) {
      return res.status(404).json({ message: 'No Fundraiser found with this ID' });
    }

    res.status(200).json(FundraiserDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

const getAllFundraiserDetails = async (req, res) => {
  try {
    const FundraiserDetails = await Fundraiser.find();

    if (!FundraiserDetails || FundraiserDetails.length === 0) {
      return res.status(404).json({ message: 'No Fundraiser found' });
    }

    res.status(200).json(FundraiserDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = { 
    addFundRaisingDetails, 
    getFundraiserDetailsByCategory, 
    getAllFundraiserDetails,
    getFundraiserDetailsById
   };
    