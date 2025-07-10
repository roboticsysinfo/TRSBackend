// models/SiteDetail.js
const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({

  platform: String,
  icon: String, // URL or icon class (like FontAwesome)
  link: String,

});

const siteDetailSchema = new mongoose.Schema({

  aboutTitle: String,
  aboutContent: String,
  termsContent: String,
  privacyContent: String,
  footerAbout: String,
  socialMedia: [socialMediaSchema],

}, {

  timestamps: true,

});

module.exports = mongoose.model('SiteDetail', siteDetailSchema);
