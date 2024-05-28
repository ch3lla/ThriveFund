const { Schema, model } = require('mongoose');

const fileSchema = new Schema({
  mediaUrl: {
    type: String,
    required: [true, "Media url is required"],
  },
  publicId: {
    type: String,
    required: [true, "Media public id is required"],
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "Coordinator",
    required: [true, "Media uploader is required"],
  },
});

const File = model('File', fileSchema);
module.exports = File;