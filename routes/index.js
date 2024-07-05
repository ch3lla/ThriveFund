const router = require('express').Router();
const { register, login } = require('../controllers/auth');
const { verifyToken } = require('../utils/verifyToken');
const { 
  addFundRaisingDetails,
  getFundraiserDetailsByCategory,
  getAllFundraiserDetails, 
  getFundraiserDetailsById
 } = require('../controllers/fundraiser.controller');
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

const {
  getSingleUserDetail,
  getCurrentUserFundraisers
} = require ("../controllers/dashboard.controller");

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/upload', verifyToken, processFileUpload, addFundRaisingDetails);

router.get('/fundraiser/:category', getFundraiserDetailsByCategory);
router.get('/fundraiser/details/:id', getFundraiserDetailsById);
router.get('/fundraiser', getAllFundraiserDetails);

router.post('/create-payment', createPaymentIntent);
router.post('/webhook', webhook);

router.get('/donors', getAlDonors);
router.get('/donors/:id', getDonorsByFundraiserId);

// router.post('/populateDb', populateDbWithTestData);
// router.post('/update', processFileUpload, getFundraiserDataAndUpdate);

router.get('/dashboard', verifyToken, getSingleUserDetail);
router.get('/dashboard/fundraisers', verifyToken, getCurrentUserFundraisers);

module.exports = router;
