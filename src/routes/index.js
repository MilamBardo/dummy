"use strict";
/// <reference path='../../typings/index.d.ts'/>
const express = require('express');
const expresssession = require('express-session');
const Promise = require('es6-promise');
const blogRouter = require("./blog");
const portfolioRouter = require("./portfolio");
const Users = require('../models/Users/User');
const UserRepository = require('../repositories/userRepository');
//import * as app from '../../app';
var router = express.Router();
router.use('/blog', blogRouter);
router.use('/portfolio', portfolioRouter);
//var app = require('../../app');
//app.use(router);
router.use(function (req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    next();
});
// G E T S
router.get('/', (req, res) => {
    var userloggedin = false;
    if (req.session) {
        if (req.session.username) {
            userloggedin = true;
        }
    }
    res.render('index', { title: 'AlmosLataan Home', loggedin: userloggedin });
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.get('/login', function (req, res) {
    res.render('login');
});
router.get('/contact', function (req, res) {
    var userloggedin = false;
    if (req.session) {
        if (req.session.username) {
            userloggedin = true;
        }
    }
    res.render('contact', { title: 'AlmosLataan Home', loggedin: userloggedin });
});
router.get('/store', function (req, res) {
    var userloggedin = false;
    if (req.session) {
        if (req.session.username) {
            userloggedin = true;
        }
    }
    res.render('store', { title: 'AlmosLataan Home', loggedin: userloggedin });
});
// P O S T S
// router.post('/registerprocess', function(req, res, next) {
router.post('/registerprocess', (req, res, next) => {
    if (req.body.email != req.body.confirmemail) {
        res.render('register', { alertmessage: "Problem when registering:  Emails don't match." });
    }
    else {
        //MUST FIRST CHECK THAT USERNAME IS NOT BEING USED ALREADY
        var bcrypt = require('bcrypt');
        const saltRounds = 10;
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                throw err;
            }
            let newUser = new Users.Users.User(req.body.username, hash, req.body.email);
            let usersRepos = new UserRepository.userRepository();
            const promise = new Promise.Promise((resolve, reject) => { resolve(usersRepos.add(newUser)); });
            promise.then((data) => {
                res.render('login', { alertmessage: "Registration successful" });
            });
            promise.catch((err) => {
                // This is never called
                res.render('register', { alertmessage: "Problem when registering, please try again. " });
            });
        });
    }
});
router.post('/login', (req, res, next) => {
    try {
        let gcapture = req.body['g-recaptcha-response'];
        let userIP = req.connection.remoteAddress;
        if (gcapture === undefined || gcapture === '' || gcapture === null) {
            //return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
            res.render('login', { alertmessage: "Fail on capthcha not selected" });
        }
        // Put your secret key here.
        var secretKey = "	6LduwSgTAAAAAJniD0mhwtBc_8V1OHt2BI6z7TYJ";
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
        // "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        var request = require('request');
        //   var headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        // this.http.post('http://some-url/', 
        //                        JSON.stringify({firstName:'Joe',lastName:'Smith'}),
        //                        {headers:headers})
        request.post(verificationUrl, { form: { secret: secretKey, response: gcapture, remoteip: userIP } }, function (error, response, body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if (body.success !== undefined && !body.success) {
                //return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
                res.render('login', { alertmessage: "Fail on request" });
            }
            //res.render('login', {alertmessage: "Ok, pass I think"});
            //res.json({"responseCode" : 0,"responseDesc" : "Success"});
            //REST OF LOGIN CODE HERE?
            let suppliedusername = req.body.user;
            let suppliedpassword = req.body.pass;
            let usersRepos = new UserRepository.userRepository();
            const promise = new Promise.Promise((resolve, reject) => { resolve(usersRepos.findany(suppliedusername)); });
            var bcrypt = require('bcrypt');
            promise.then((data) => {
                if (data != null && !data.lockedout) {
                    bcrypt.compare(suppliedpassword, data.encryptedpassword, function (err, match) {
                        // res == true
                        if (err) {
                            throw err;
                        }
                        if (match) {
                            if (req.session) {
                                //req.session.user = suppliedusername
                                req.session.username = data.name;
                                req.session.userisadmin = data.isadmin;
                                res.render('index', { title: 'AlmosLataan Home', loggedin: true });
                            }
                            else {
                                res.render('login', { alertmessage: "Problem with logging in to session" });
                            }
                        }
                        else {
                            //Can't access class method - suspicion is that pg-promise isn't returning real objects
                            //data.incrementloginattempts(); 
                            //SO, TEMP FIX
                            data.loginattempts++;
                            if (data.loginattempts > 3) {
                                data.lockedout = true;
                            }
                            //NOTICE NO PROMISE
                            usersRepos.update(data);
                            res.render('login', { alertmessage: "Login details don't match" });
                        }
                    });
                }
                else if (data.lockedout) {
                    res.render('login', { alertmessage: "This account is locked out.  Please request unlock. " });
                }
                else {
                    res.render('login', { alertmessage: "Login details not found" });
                }
            });
            promise.catch((err) => {
                // This is never called
                //console.log('I didnt get called:');
                res.render('login', { alertmessage: "Error when logging in " + err.message });
            });
        });
    }
    catch (err) {
        res.render('login', { alertmessage: "Error when logging in.  Internal issue - please report" });
    }
});
router.post('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
        if (err)
            return next(err);
        res.render('index', { title: 'AlmosLataan Home' });
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map