const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const upload = require('../middlewares/upload');


router.post('/add-interview', upload.single('profileImage'), interviewController.addInterview);


router.get('/all-interviews', interviewController.getAllInterviews);


router.get('/single-interview/:id', interviewController.getInterviewById);


router.put('/update/interview/:id', upload.single('profileImage'), interviewController.updateInterview);


router.delete('/delete/interview/:id', interviewController.deleteInterview);


module.exports = router;
