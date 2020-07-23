const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    OTP: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    countryCode: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true,
        unique: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('User', userSchema);