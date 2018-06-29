const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tiruchengode'); 
mongoose.Promise = global.Promise;
module.export = {mongoose};