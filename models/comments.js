const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = Schema({
    commentContent: {
        type: String,
        required: true
    },
    userRef: String,
    username: String,
    threadRef: String
    // likes: {
    //     type: Number,
    //     default: 0
    // },
    // likeUsers: Schema.Types.Mixed,
}, {timestamps: true});


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;