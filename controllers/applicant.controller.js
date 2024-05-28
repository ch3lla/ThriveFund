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
    upload.array('uploads')(req, res, async (err) => {
      if (err) {
        return errorHandler(err, res);
      }

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

      const fundingMedia = req.files
        ? await Promise.all(
            req.files.map(async (file) => {
              const newFile = new File({
                name: file.originalname,
                data: file.buffer,
                contentType: file.mimetype,
              });
              const savedFile = await newFile.save();
              return savedFile._id;
            })
          )
        : [];

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
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { addFundRaisingDetails };