const router = require('express').Router();
const { register, login } = require('../controllers/auth');
const { verifyToken } = require('../utils/verifyToken');
const { addFundRaisingDetails } = require('../controllers/applicant.controller');
const {
    processFileUpload,
  } = require("../middlewares/media_upload");

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/upload', verifyToken, processFileUpload, addFundRaisingDetails);

module.exports = router;
