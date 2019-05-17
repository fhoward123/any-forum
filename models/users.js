const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Thread = require('./threads.js');

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    threads: [Thread.schema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;