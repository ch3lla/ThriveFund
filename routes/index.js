const router = require('express').Router();
const { register, login } = require('../controllers/auth');
const { verifyToken } = require('../utils/verifyToken');
const { 
  addFundRaisingDetails,
  getApplicantDetailsByCategory,
  getAllApplicantDetails, 
  getApplicantDetailsById
 } = require('../controllers/applicant.controller');
const {
    processFileUpload,
  } = require("../middleware/media_upload");

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/upload', verifyToken, processFileUpload, addFundRaisingDetails);

router.get('/fundraiser/:category', getApplicantDetailsByCategory);
router.get('/fundraiser/details/:id', getApplicantDetailsById);

router.get('/fundraiser', getAllApplicantDetails);

module.exports = router;
