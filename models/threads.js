const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comments.js');

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
    },
    likeUsers: Schema.Types.Mixed,
    comments: [Comment.schema],
    userImg: {
        type: String,
        default: '/assets/images/avatar-default-icon.png'
    }
}, {timestamps: true});


const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;