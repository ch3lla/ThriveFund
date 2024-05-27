const router = require('express').Router();
const { register, login } = require('../controllers/auth');
const { verifyToken } = require('../utils/verifyToken');
const upload = require('../utils/multerConfig');
const { addFundRaisingDetails } = require('../controllers/applicant.controller');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/upload', verifyToken, upload.array('uploads'), addFundRaisingDetails);

module.exports = router;
