const { request, response } = require('express');
const Applicant = require('../models/Applicants');
const File = require('../models/Files');
const upload = require('../utils/multerConfig');
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

module.exports = { addFundRaisingDetails };