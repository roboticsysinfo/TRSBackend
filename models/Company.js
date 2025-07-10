const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String, // URL or path to image
  },
  about: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    googleMyBusiness: { type: String }
  },
  businessModel: {
    type: String,
    enum: ['B2C', 'B2B', 'B2B2C', 'D2C', 'C2C', 'B2G'],
    required: true,
  },
  legalName: {
    type: String,
    required: true,
  },
  headquarter: {
    type: String,
    required: true,
  },
  foundingDate: {
    type: Date,
    required: true,
  },
  noOfEmployees: {
    type: String,
    enum: ['0-10', '10-100', '100-1000', '1000-100000'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // default to false
  },
  coreTeam: [
    {
      memberName: { type: String, required: true },
      designation: { type: String, required: true },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
