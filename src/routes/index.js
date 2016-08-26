"use strict";
/// <reference path='../../typings/index.d.ts'/>
const express = require('express');
const expresssession = require('express-session');
const Promise = require('es6-promise');
const blogRouter = require("./blog");
const Users = require('../models/Users/User');
const UserRepository = require('../repositories/userRepository');
//import * as app from '../../app';
var router = express.Router();
router.use('/blog', blogRouter);
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
    res.render('contact');
});
router.get('/store', function (req, res) {
    res.render('store');
});
// P O S T S
// router.post('/registerprocess', function(req, res, next) {
router.post('/registerprocess', (req, res, next) => {
    if (req.body.email != req.body.confirmemail) {
        res.render('register', { alertmessage: "Problem when registering:  Emails don't match." });
    }
    else {
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
                res.render('login', { alertmessage: "Problem when registering, please try again. " });
            });
        });
    }
});
router.post('/login', (req, res, next) => {
    let suppliedusername = req.body.user;
    let suppliedpassword = req.body.pass;
    let usersRepos = new UserRepository.userRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(usersRepos.findany(suppliedusername)); });
    var bcrypt = require('bcrypt');
    promise.then((data) => {
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
                res.render('login', { alertmessage: "Login details don't match" });
            }
        });
    });
    promise.catch((err) => {
        // This is never called
        //console.log('I didnt get called:');
        res.render('login', { alertmessage: "Error when logging in " + err.message });
    });
    //   const p: Promise<string> = new Promise (
    //    (resolve: (str: string)=>void, reject: (str: string)=>void) => {
    //       const a: string = "hello from Promise";
    //       resolve(a);
    //    }
    //  );
    // p.then((st) => {
    //   console.log(st);
    // });
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