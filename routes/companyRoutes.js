const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const upload = require('../middlewares/upload');


// Create or Update (Upsert)
router.post('/list-compnay', upload.single('logo'), authMiddleware, companyController.createCompany);


// ✅ Verify Company by ID
router.put('/verify/company/:id', adminAuthMiddleware, companyController.verifyCompany);


// Get All Companies
router.get('/companies', companyController.getAllCompanies);


// Get Company by Company ID
router.get('/company/by-cid/:id', companyController.getCompanyById);


// Get Company by User ID
router.get('/company/by-user/:userId', companyController.getCompanyByUserId);


// Update Company by ID
router.put('/update/company/:id', upload.single('logo'), authMiddleware, companyController.updateCompany);


// Delete Company by ID
router.delete('/delete/company/:id', adminAuthMiddleware, companyController.deleteCompany);


module.exports = router;
