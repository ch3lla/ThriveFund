const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/')) {
    return cb(new Error('Only images and documents are allowed!'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 25 }, // Maximum file size (25MB in this case)
});

module.exports = upload;