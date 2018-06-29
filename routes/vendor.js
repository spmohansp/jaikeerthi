const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongooseConnection');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/productImage')
    },
    filename: (req, file, callback) => {
        var filetype = file.mimetype;
        var fileformate = filetype.split("/")[1];
        callback(null, req.body.productName + '_' + Date.now() + '.' + fileformate);
    }
});
var upload = multer({ storage: storage });


const { Vendors } = require('../model/admin/vendor');
const { Catagories } = require('../model/admin/catagory');
const { Products } = require('../model/admin/product');




const passport = require('passport');//passport initialize
const LocalStrategy = require('passport-local').Strategy;

function isAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/vendor/login');
}



router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/vendor/dashboard');
    } else {
        res.redirect('/vendor/login');
    }
});

router.get('/login', (req, res) => {
    res.render('vendor/login');
});

router.post('/login', passport.authenticate('vendor-local', { failureRedirect: '/vendor/login', }), (req, res) => {
    res.redirect('/vendor/dashboard');
});


router.get('/dashboard', isAuthenticatedUser, (req, res) => {
    res.render('Vendor/dashboard', {
        VendorData: req.user
    });
});


router.get('/products', isAuthenticatedUser, (req, res) => {
    Products.find({ vendorId: req.user.id }).populate('catagory').then((productData) => {
        res.render('Vendor/products', {
            ProductList: productData,
            VendorData: req.user
        });
    })
});


router.get('/products/addProducts', isAuthenticatedUser, (req, res) => {
    Catagories.find({ status: 1 }).then((CatagoryList) => {
        res.render('Vendor/addProducts', {
            vendorData: "5b2b76cb7dffeb1298f0651d",
            catagoryData: CatagoryList,
            VendorData: req.user
        });
    })
});

router.post('/products/addProducts', upload.single('productImage'), (req, res) => {
    var productDatas = new Products({
        vendorId: req.user.id,
        productName: req.body.productName,
        price: req.body.price,
        discription: req.body.discription,
        quantity: req.body.quantity,
        catagory: req.body.catagory,
        offerDate: req.body.offerDate,
        offerPrice: req.body.offerPrice,
        productImage: req.file.filename,
    });
    productDatas.save().then(() => {
        res.redirect('/vendor/products');
    }, (err) => {
        res.redirect('/vendor/products');
    })
});

router.get('/products/:id', (req, res) => {
    Catagories.find({ status: 1 }).then((CatagoryList) => {
        Products.findById(req.params.id).then((productData) => {
            res.render('Vendor/editProducts', {
                ProductList: productData,
                catagoryData: CatagoryList,
                VendorData: req.user
            });
        })
    });
});


router.post('/products/addProducts/:id', upload.single('productImage'), (req, res) => {
    if (req.file) {
        Products.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorId: req.user.id,
                productName: req.body.productName,
                price: req.body.price,
                discription: req.body.discription,
                quantity: req.body.quantity,
                catagory: req.body.catagory,
                offerDate: req.body.offerDate,
                offerPrice: req.body.offerPrice,
                productImage: req.file.filename,
                status: 0
            }
        }).then(() => {
            res.redirect('/vendor/products');
        }, (err) => {
            res.redirect('/vendor/products');
        })
    } else {
        Products.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorId: req.user.id,
                productName: req.body.productName,
                price: req.body.price,
                discription: req.body.discription,
                quantity: req.body.quantity,
                catagory: req.body.catagory,
                offerDate: req.body.offerDate,
                offerPrice: req.body.offerPrice,
                status: 0
            }
        }).then(() => {
            res.redirect('/vendor/products');
        }, (err) => {
            res.redirect('/vendor/products');
        })
    }
});







module.exports = router;