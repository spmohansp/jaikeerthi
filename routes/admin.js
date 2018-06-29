const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongooseConnection');
var multer = require('multer');

const { Vendors } = require('../model/admin/vendor');
const { Catagories } = require('../model/admin/catagory');
const { Products } = require('../model/admin/product');

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


const passport = require('passport');//passport initialize
const LocalStrategy = require('passport-local').Strategy;

function isAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/admin/login');
}


router.get('/', (req, res) => {
    res.redirect('admin/login');
});


router.get('/login', (req, res) => {
    res.render('Admin/login');
});


router.post('/login', passport.authenticate('admin', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/admin/dashboard');
});


router.get('/dashboard', (req, res) => {
    Promise.all([Products.count({ status: 1 }), Products.count({ status: 0 })]).then(([ApprovedproductCount, unApprovedproductCount]) => {
        res.render('Admin/dashboard', {
            ApprovedproductCount: ApprovedproductCount,
            unApprovedproductCount: unApprovedproductCount
        });
    })
});


// VENDOR
router.get('/vendor', (req, res) => {
    Vendors.find().then((vendorDatas) => {
        res.render('Admin/vendor', {
            vendorDatas: vendorDatas
        });
    })
});

router.get('/vendor/addVendor', (req, res) => {
    res.render('Admin/addVendor');
});

router.post('/vendor/addVendor', (req, res) => {
    vendorData = new Vendors(req.body);
    vendorData.save().then((Data) => {
        res.redirect('/admin/vendor');
    }, (err) => {
        res.redirect('/admin/vendor');
    })
});

router.get('/vendor/:id', (req, res) => {
    Vendors.findById(req.params.id).then((vendorData) => {
        res.render('Admin/editVendor', {
            vendorData: vendorData
        });
    })
});

router.post('/vendor/:id', (req, res) => {
    if (req.body.status) {
        status = 1;
    } else {
        status = 0;
    }
    if (req.body.Password == '') {
        Vendors.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorName: req.body.vendorName,
                shopName: req.body.shopName,
                address: req.body.address,
                mobile: req.body.mobile,
                gstNumber: req.body.gstNumber,
                bankName: req.body.bankName,
                ifscCode: req.body.ifscCode,
                accountNumber: req.body.accountNumber,
                email: req.body.email,
                status: status,
            }
        }).then(() => {
            res.redirect('/admin/vendor');
        }, (err) => {
            res.redirect('/admin/vendor');
        })
    } else {
        Vendors.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorName: req.body.vendorName,
                shopName: req.body.shopName,
                address: req.body.address,
                mobile: req.body.mobile,
                gstNumber: req.body.gstNumber,
                bankName: req.body.bankName,
                ifscCode: req.body.ifscCode,
                accountNumber: req.body.accountNumber,
                email: req.body.email,
                Password: req.body.Password,
                status: status,
            }
        }).then(() => {
            res.redirect('/admin/vendor');
        }, (err) => {
            res.redirect('/admin/vendor');
        })
    }
});


// CARAGORY
router.get('/catagory', (req, res) => {
    Catagories.find().then((catagoryData) => {
        res.render('Admin/catagory', {
            catagoryData: catagoryData
        });
    })

});

router.post('/catagory/addCatagory', (req, res) => {
    CatagoryData = new Catagories(req.body);
    CatagoryData.save().then(() => {
        res.redirect('/Admin/catagory');
    }, (err) => {
        res.redirect('/Admin/catagory');
    })
});

router.get('/catagory/:id', (req, res) => {
    Catagories.findById(req.params.id).then((catagoryData) => {
        res.render('Admin/editCatagory', {
            catagoryData: catagoryData
        });
    });
});

router.post('/catagory/addCatagory/:id', (req, res) => {
    if (req.body.status) {
        status = 1;
    } else {
        status = 0;
    }
    Catagories.findByIdAndUpdate(req.params.id, {
        $set: {
            catagory: req.body.catagory,
            status: status,
        }
    }).then(() => {
        res.redirect('/Admin/catagory');
    }, (err) => {
        res.redirect('/Admin/catagory');
    })
});


// PRODUCTS
router.get('/products', (req, res) => {
    Products.find().populate(['vendor', 'catagory']).then((productData) => {
        res.render('Admin/products', {
            ProductList: productData
        });
    })
});

router.get('/products/addProducts', (req, res) => {
    Vendors.find({ status: 1 }).then((VendorList) => {
        Catagories.find({ status: 1 }).then((CatagoryList) => {
            res.render('Admin/addProducts', {
                vendorData: VendorList,
                catagoryData: CatagoryList,
            });
        })
    })
});


router.post('/products/addProducts', upload.single('productImage'), (req, res) => {
    var productDatas = new Products({
        vendorId: req.body.vendorId,
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
        res.redirect('/Admin/products');
    }, (err) => {
        res.redirect('/Admin/products');
    })
});

router.get('/products/:id', (req, res) => {
    Vendors.find({ status: 1 }).then((VendorList) => {
        Catagories.find({ status: 1 }).then((CatagoryList) => {
            Products.findById(req.params.id).then((productData) => {
                res.render('Admin/editProducts', {
                    ProductList: productData,
                    vendorData: VendorList,
                    catagoryData: CatagoryList,
                });
            })
        });
    })
});


router.post('/products/addProducts/:id', upload.single('productImage'), (req, res) => {
    if (req.body.status) {
        status = 1;
    } else {
        status = 0;
    }
    if (req.file) {
        Products.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorId: req.body.vendorId,
                productName: req.body.productName,
                price: req.body.price,
                discription: req.body.discription,
                quantity: req.body.quantity,
                catagory: req.body.catagory,
                offerDate: req.body.offerDate,
                offerPrice: req.body.offerPrice,
                productImage: req.file.filename,
                status: status
            }
        }).then(() => {
            res.redirect('/Admin/products');
        }, (err) => {
            res.redirect('/Admin/products');
        })
    } else {
        Products.findByIdAndUpdate(req.params.id, {
            $set: {
                vendorId: req.body.vendorId,
                productName: req.body.productName,
                price: req.body.price,
                discription: req.body.discription,
                quantity: req.body.quantity,
                catagory: req.body.catagory,
                offerDate: req.body.offerDate,
                offerPrice: req.body.offerPrice,
                status: status
            }
        }).then(() => {
            res.redirect('/Admin/products');
        }, (err) => {
            res.redirect('/Admin/products');
        })
    }

});



module.exports = router;