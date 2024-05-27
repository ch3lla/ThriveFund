const { Schema, model } = require('mongoose');
const { isMobilePhone, isEmail } = require('validator');

const fileSchema = new Schema({
    name: String,
    data: Buffer,
    contentType: String,
  });

const applicantSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: [true, 'Firstname is required.'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Email must be a valid email.'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    minLength: [11, 'Phone number must be at least 11 characters'],
    validate: [isMobilePhone, 'Phone number must be a valid phone number'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  fundraiserTitle: {
    type: String,
    required: [true, 'Fundraiser Title is required'],
  },
  fundraiserDescription: {
    type: String,
    required: [true, 'Fundraiser Description is required'],
  },
  goal: {
    type: String,
    required: [true, 'Fundraiser goal is required'],
  },
  category: {
    type: String,
    enum: ['Medical', 'Education', 'Business', 'Others'],
    required: [true, 'Category is required']
  },
  deadline: {
    type: Date,
  },
  fundingMedia: [{ type: Schema.Types.ObjectId, ref: 'File' }],
}, { timestamps: true });

const Applicant = model('Applicant', applicantSchema);
module.exports = Applicant;