const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const interviewSchema = new mongoose.Schema({

    personName: { type: String, required: true },

    designation: { type: String, required: true },

    profileImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },

    excerpt: { type: String },

    qa: [questionAnswerSchema],

    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Interview', interviewSchema);
