const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    description: String,
    size: [String],
    color: [String],
    images: [String],
    category: [String]
});


// Export Model
module.exports = mongoose.model('Product', ProductSchema);