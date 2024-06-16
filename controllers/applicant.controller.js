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

const populateDbWithTestData = async (req, res) => {
  try {
    const data = req.body;
    const promises = data.map(async (item) => {
      const applicant = new Applicant({
        userId: item.userId,
        firstname: item.firstname,
        lastname: item.lastname,
        email: item.email,
        phone: item.phone,
        address: item.address,
        fundraiserTitle: item.fundraiserTitle,
        fundraiserDescription: item.fundraiserDescription,
        goal: item.goal,
        category: item.category,
        deadline: item.deadline,
        fundingMedia: item.fundingMedia.map(media => ({
          name: media.name,
          pathToFile: media.pathToFile,
          publicId: media.publicId
        })),
        isApproved: item.isApproved,
        amountRaised: item.amountRaised,
        donations: item.donations
      });

      // Save the applicant to the database
      return await applicant.save();
    });

    // Wait for all promises to complete
    const results = await Promise.all(promises);

    res.status(200).json({
      message: "Data successfully added to the database.",
      results: results
    });

  } catch (error) {
    res.status(500).json({
      message: "An error occurred while populating the database.",
      error: error.message
    });
  }
};

const getApplicantDataAndUpdate = async (req, res) => {
  try {
    const {
      userId
    } = req.body;

    const fundingMedia =
      {
        name: req.body.name,
        pathToFile: req.body.pathToFile,
        publicId: req.body.publicId
      };
    const applicantDetails = await Applicant.findOneAndUpdate({userId: userId}, {fundingMedia: fundingMedia}, {new: true});
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
    getApplicantDetailsById,
    populateDbWithTestData,
    getApplicantDataAndUpdate };
    