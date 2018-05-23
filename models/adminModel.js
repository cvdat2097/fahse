const mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Export Model
module.exports = mongoose.model('Admin', adminSchema);