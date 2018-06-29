const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongooseConnection');


const { Products } = require('../model/admin/product');
const { Vendors } = require('../model/admin/vendor');
const { Catagories } = require('../model/admin/catagory');


router.get('/', (req, res) => {
    Products.find().then((productData) => {
        res.render('User/home');
    });
});

module.exports = router;