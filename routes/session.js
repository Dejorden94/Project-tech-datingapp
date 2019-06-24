var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function(req, res, next){
    res.render('login', {title: 'Form Validation', succes: false, errors: req.session.errors});
    req.session.errors = null;
});

router.post('/submit', function(req, res, next){
    req.check('email', 'Invalid email adress').isEmail();
    req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword)
    
    var errors = req.validationErrors();
    if (errors){
        req.session.errors = errors;
    }
    res.redirect('/');
});

module.exports = session;

