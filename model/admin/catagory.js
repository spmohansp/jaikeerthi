var mongoose = require('mongoose');
var catagorySchema = new mongoose.Schema({
    catagory: {
        type: String,
        required: true,
        unique: [true, 'Already Present']
    },
    status: {
        type: String,
        default: 1
    },
});

var Catagories = mongoose.model('catagory', catagorySchema);
module.exports = { Catagories }