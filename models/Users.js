const { Schema, model } = require('mongoose');
const { compare, hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { isMobilePhone, isEmail } = require('validator');

const accountSchema = new Schema({
  accountNumber: { 
    type: String
  },
  accountName: {
    type: String
  },
  bankCode: {
    type: String
  },
  bankName: {
    type: String
  },
  _id: false
});

const userSchema = new Schema({
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
  password: {
    type: String,
    required: [true, 'Please specifiy a password'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    minLength: [11, 'Phone number must be at least 11 characters'],
    validate: [isMobilePhone, 'Phone number must be a valid phone number'],
    trim: true,
  },/* 
  tokens: [
    {
      _id: false,
      token: {
        type: String,
        required: true,
      },
    },
  ], */
  forgotPasswordToken: {
    type: String
  },
  accountDetails: accountSchema,
  fundraisers: { type: Schema.Types.ObjectId, ref: 'Fundraiser' }
}, { timestamps: true });

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '5h' });
  // user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.getPopulatedFundraisers = async function() {
  await this.populate('fundraisers');
  return this.fundraisers;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('This email has not been registered on our system.');
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }
  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hash(user.password, 8);
  }
  next();
});

const User = model('User', userSchema);
module.exports = User;