const cloudinary = require('cloudinary').v2;
const { Readable } = require("stream");

async function uploadStream(buffer) {
  return new Promise((res, rej) => {
    const options = {
        use_filename: true,
        resource_type: "auto",
        folder: 'thrivefund'
    }
    const theTransformStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return rej(err);
        res(result);
      }
    );
    let str = Readable.from(buffer);
    str.pipe(theTransformStream);
  });
}

const processFileUpload = async function (req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({ message: "Please upload a file" });
      return;
    }

    const allowedMimeTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
      ];
      
      const file = req.files.fundingMedia;
const mimeType = file.mimetype || file.type;

      if (!allowedMimeTypes.includes(mimeType)) {
        res.status(400).json({ message: "Only PDF, JPG, JPEG, and PNG files are allowed" });
        return;
      }
      

    const buffer = req.files.fundingMedia.data;
    const result = await uploadStream(buffer);

    // update the req.body
    req.body = {
      ...req.body,
      name: req.files.fundingMedia.name.toLowerCase(),
      pathToFile: result.secure_url,
      publicId: result.public_id
    };
    next();

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while uploading file" });
    return;
  }
};

module.exports = {
  processFileUpload,
};