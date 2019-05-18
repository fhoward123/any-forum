const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
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
    },
    threads: [Thread.schema]
});

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
