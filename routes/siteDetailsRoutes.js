const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/siteDetailsController');

router.get('/get-site-details', ctrl.getSiteDetail);

router.put('/about', ctrl.updateAbout);
router.put('/terms', ctrl.updateTerms);
router.put('/privacy', ctrl.updatePrivacy);
router.put('/footer', ctrl.updateFooter);

router.post('/social-media', ctrl.addSocialMedia);
router.delete('/social-media/:id', ctrl.deleteSocialMedia);


module.exports = router;
