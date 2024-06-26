const { Schema, model } = require('mongoose');

const donorSchema = new Schema({
    paymentIntentId: { type: String },
    fundraiserId: { type: String, required: true},
    amount: { type: Number },
    currency: { type: String },
    donorName: { type: String },
    donorEmail: { type: String },
    anonymity: { type: String },
});

const Donor = model('Donor', donorSchema);
module.exports = Donor;