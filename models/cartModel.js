const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    session: String,
    detail: []
});

// Export Model
module.exports = mongoose.model('Cart', cartSchema);