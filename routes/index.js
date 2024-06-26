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

const {
  createPaymentIntent,
  webhook
} = require("../controllers/payment.controller");

const {
  getAlDonors,
  getDonorsByFundraiserId
} = require("../controllers/donor.controller");

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/upload', verifyToken, processFileUpload, addFundRaisingDetails);

router.get('/fundraiser/:category', getApplicantDetailsByCategory);
router.get('/fundraiser/details/:id', getApplicantDetailsById);
router.get('/fundraiser', getAllApplicantDetails);

router.post('/create-payment', createPaymentIntent);
router.post('/webhook', webhook);

router.get('/donors', getAlDonors);
router.get('/donors/:id', getDonorsByFundraiserId);

router.post('/populateDb', populateDbWithTestData);
router.post('/update', processFileUpload, getApplicantDataAndUpdate);

module.exports = router;
