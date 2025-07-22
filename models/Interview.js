const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const interviewSchema = new mongoose.Schema({

    interviewTitle: { type: String, required: true },

    personName: { type: String, required: true },

    designation: { type: String, required: true },

    profileImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },

    excerpt: { type: String },

    qa: [questionAnswerSchema],

    interviewImage: {
        type: String,
        default: 'https://placehold.co/600x400'
    },

    createdAt: { type: Date, default: Date.now }

}, {
    timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
