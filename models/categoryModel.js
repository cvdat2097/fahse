const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: String
});

// Export Model
module.exports = mongoose.model('Category', categorySchema);