const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

router.post('/create-contact', contactController.createContact);

router.get('/contacts', adminAuthMiddleware, contactController.getAllContacts);

router.get('/single-contact/:id', adminAuthMiddleware, contactController.getContactById);

router.put('/update/contact/:id', adminAuthMiddleware, contactController.updateContact);

router.delete('/delete/contact/:id', adminAuthMiddleware, contactController.deleteContact);

module.exports = router;
