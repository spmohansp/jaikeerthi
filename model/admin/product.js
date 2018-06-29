var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
    },
    catagory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'catagory',
        required: true
    },
    offerDate: {
        type: String,
        allowBlank: true
    },
    offerPrice: {
        type: String,
        allowBlank: true
    },
    status: {
        type: String,
        default: 0
    },
});

var Products = mongoose.model('products', productSchema);
module.exports = { Products }