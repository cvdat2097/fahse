const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    size: [String],
    color: [String],
    images: [String],
    view: {
        type: Number,
        default: 0
    },
    nItemSold: {
        type: Number,
        default: 0
    },
    category: [mongoose.Schema.ObjectId],
    relatedProducts: [],
    comment: []
});


// Export Model
module.exports = mongoose.model('Product', ProductSchema);