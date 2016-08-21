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
// P O S T S
// router.post('/registerprocess', function(req, res, next) {
router.post('/registerprocess', (req, res, next) => {
    console.log(req.body.user);
    console.log(req.body.pass);
    // var Users = require('../models/Users/User');
    // var users = require('./models/Users/Users');
    // var users = require('Users');
    //var users = require('../../models/Users/User.ts');
    let newUser = new Users.Users.User(req.body.user, req.body.pass);
    let usersRepos = new UserRepository.userRepository();
    var r = usersRepos.add(newUser);
    res.render('login', { registrationsuccess: true });
});
router.post('/login', (req, res, next) => {
    let suppliedusername = req.body.user;
    let suppliedpassword = req.body.pass;
    let usersRepos = new UserRepository.userRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(usersRepos.findany(suppliedusername)); });
    promise.then((data) => {
        if (data.name == suppliedusername) {
            if (req.session) {
                //req.session.user = suppliedusername
                req.session.username = data.name;
                req.session.userisadmin = data.isadmin;
                res.render('index', { title: 'AlmosLataan Home', loggedin: true });
            }
            else {
                console.log("boo, request and session not available");
                res.render('login');
            }
        }
    });
    promise.catch((err) => {
        // This is never called
        console.log('I didnt get called:');
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
    req.session.destroy;
    next;
});
module.exports = router;
//# sourceMappingURL=index.js.map