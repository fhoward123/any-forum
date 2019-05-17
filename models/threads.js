const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const threadSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userRef: String,
    username: String,
    likes: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;