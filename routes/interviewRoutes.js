// routes/interviewRoutes.js

const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const upload = require('../middlewares/upload');

router.post(
  '/add-interview',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'interviewImage', maxCount: 1 }
  ]),
  interviewController.addInterview
);

router.get('/all-interviews', interviewController.getAllInterviews);

router.get('/single-interview/:id', interviewController.getInterviewById);

router.put(
  '/update/interview/:id',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'interviewImage', maxCount: 1 }
  ]),
  interviewController.updateInterview
);

router.delete('/delete/interview/:id', interviewController.deleteInterview);

module.exports = router;
