const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'delivering', 'delivered']
    },
    user: mongoose.Schema.ObjectId,
    detail: [],
    note: String,
    recipientName: String,
    address: String,
    phone: String
});

// Export Model
module.exports = mongoose.model('Order', orderSchema);