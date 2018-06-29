var mongoose = require('mongoose');
var vendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10,
        unique: [true, 'Already Present']
    },
    gstNumber: {
        type: String,
        allowBlank: true
    },
    bankName: {
        type: String,
        allowBlank: true
    },
    ifscCode: {
        type: String,
        allowBlank: true
    },
    accountNumber: {
        type: String,
        allowBlank: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Already Present']
    },
    Password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 0
    },
});

var Vendors = mongoose.model('vendors', vendorSchema);
module.exports = { Vendors }