const { request, response } = require('express');
const Applicant = require('../models/Applicants');
const upload = require('../utils/multerConfig');
const errorHandler = require('../utils/errorHandler');

/**
 * Handles fund raiser creation logic
 * @param { request } req
 * @param { response } res
 */
const addFundRaisingDetails = async (req, res) => {
    const { _id } = req.user;

    if (!_id){
        res.status(401).json({ message: "Invalid token"});
    }

    try {
        upload.array('uploads')(req, res, async (err) => {
            if (err) {
              return errorHandler(req, err);
            }
            const { firstname, lastname, email, phone, address, fundraiserTitle, fundraiserDescription, goal, category, deadline } = req.body;
    
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
              uploads: req.files, // Assign uploaded files
            });
            await newApplicant.save();
      
            res.status(200).json({ message: 'Applicant details and files saved successfully!' });
          });

    } catch (error){
        errorHandler(req, error);
    }
}

module.exports = { addFundRaisingDetails }