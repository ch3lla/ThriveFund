const { request, response } = require('express');
const Applicant = require('../models/Applicants');
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

      const newApplicant = new Applicant({
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

      await newApplicant.save();
      res.status(201).json({ message: 'Applicant details and files saved successfully!' });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getApplicantDetailsByCategory = async (req, res) => {
  try {
    let { category } = req.params;

    if (!category) {
      res.status(400).json({ message: 'Category cannot be null'});
    }

    const applicantDetails = await Applicant.find({ category });

    if (!applicantDetails || applicantDetails.length === 0) {
      return res.status(404).json({ message: 'No applicants found for this category' });
    }

    res.status(200).json(applicantDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

const getApplicantDetailsById = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'ID cannot be null'});
    }

    const applicantDetails = await Applicant.findById(id);

    if (!applicantDetails || applicantDetails.length === 0) {
      return res.status(404).json({ message: 'No applicants found with this ID' });
    }

    res.status(200).json(applicantDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

const getAllApplicantDetails = async (req, res) => {
  try {
    const applicantDetails = await Applicant.find();

    if (!applicantDetails || applicantDetails.length === 0) {
      return res.status(404).json({ message: 'No applicants found' });
    }

    res.status(200).json(applicantDetails);
    
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = { 
    addFundRaisingDetails, 
    getApplicantDetailsByCategory, 
    getAllApplicantDetails,
    getApplicantDetailsById
   };
    