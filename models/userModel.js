const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    username: String,
    password: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    emailIsActivated: {
        type: Boolean,
        default: false
    },
    emailActivationCode: String
});

// Export Model
module.exports = mongoose.model('User', userSchema);