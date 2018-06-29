const express = require('express');//initialize express
const app = express();
app.set('port', process.env.PORT || 3000);//port initialization
app.listen(app.get('port'));
app.set('view engine', 'ejs');//routing for ejs files
app.use(express.static(__dirname + '/public'));//initialize a static folder public(used for css & js)
const bodyParser = require('body-parser');//body praser to get data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const mongooseConnection = require('./db/mongooseConnection');
var multer = require('multer');

const session = require('express-session');//install
const mongoconnect = require('connect-mongo')(session);//install
const passport = require('passport');//passport initialize
const LocalStrategy = require('passport-local').Strategy;

var chatSession = session({
    secret: 'mdjnreju38dmdfsdfjs83ki8k', //session secret key 
    resave: true,
    saveUninitialized: true,
    store: new mongoconnect({ mongooseConnection: mongoose.connection })  // session save to db
});

app.use(chatSession);
app.use(passport.initialize());
app.use(passport.session());



const { Vendors } = require('./model/admin/vendor');


var main = require('./routes/main');
app.use('/', main);

var admin = require('./routes/admin');
app.use('/admin', admin);

var vendor = require('./routes/vendor');
app.use('/vendor', vendor);

var user = require('./routes/user');
app.use('/user', user);









app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

passport.use('vendor-local', new LocalStrategy(
    function (username, password, done) {
        Vendors.findOne({ email: username }).then((vendor) => {
            if (vendor) {
                if (vendor.Password == password) {
                    done(null, vendor);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        })
    }
));

passport.serializeUser((vendor, done) => {
    done(null, vendor.id);
});

passport.deserializeUser((id, done) => {
    Vendors.findById(id, (err, vendor) => {
        done(err, vendor);
    });
});

passport.use('admin', new LocalStrategy(
    function (username, password, done) {
        if (username === 'mohan' && password === 'mohan') {
            done(null, username);
        } else {
            done(null, false);
        }
    }
));

