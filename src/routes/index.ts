/// <reference path='../../typings/index.d.ts'/>
import * as express from 'express'
const expresssession = require('express-session');
const Promise = require('es6-promise');
import * as blogRouter from "./blog";
import * as Users from '../models/Users/User';
import * as UserRepository from '../repositories/userRepository';

//import * as app from '../../app';


var router = express.Router();

router.use('/blog', blogRouter);

//var app = require('../../app');
//app.use(router);

router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);


    next(); 
});

// G E T S
router.get('/', (req, res) => {
  var userloggedin = false;
  if (req.session)
  {
    if (req.session.username)
    {
      userloggedin=true;
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
  router.post('/registerprocess', (req:any, res:any, next: any) =>{

    if (req.body.email != req.body.confirmemail)
    {
      res.render('register', {alertmessage: "Problem when registering:  Emails don't match."});
    }
    else{

          var bcrypt = require('bcrypt');
          const saltRounds = 10;

          bcrypt.hash(req.body.password, 10, function(err:Error, hash:any) {
              // Store hash in your password DB.
                if (err)
                {
                  throw err;
                }

              let newUser = new Users.Users.User(req.body.username, hash, req.body.email)

              let usersRepos = new UserRepository.userRepository();
              
              const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(usersRepos.add(newUser)); });
              promise.then((data:any) => {
                res.render('login', {alertmessage: "Registration successful"});
              });
              promise.catch((err : any) => {
                // This is never called
                res.render('login', {alertmessage: "Problem when registering, please try again. "});
              });
      });
    }
  });

router.post('/login', (req:any, res:any, next: any) =>{
  let suppliedusername = req.body.user;
  let suppliedpassword = req.body.pass;
  let usersRepos = new UserRepository.userRepository();

  const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(usersRepos.findany(suppliedusername)); });
  var bcrypt = require('bcrypt');
  promise.then((data:any) => {
        bcrypt.compare(suppliedpassword, data.encryptedpassword, function(err: Error, match: any) {
          // res == true
          if(err)
          {
            throw err;
          }

          if(match)
          {
              if (req.session) {
                  //req.session.user = suppliedusername
                  req.session.username = data.name;
                  req.session.userisadmin = data.isadmin;
                  res.render('index', { title: 'AlmosLataan Home', loggedin: true });
              }
              else {
                  res.render('login', {alertmessage: "Problem with logging in to session"});
              }
          }
          else
          {
            res.render('login', {alertmessage: "Login details don't match"});
          }
        });
    });
  promise.catch((err : Error) => {
      // This is never called
      //console.log('I didnt get called:');
      res.render('login', {alertmessage: "Error when logging in "+err.message});
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

router.post('/logout', (req:any, res:any, next: any) =>{
  req.session.destroy(function (err: any) {
    if (err) return next(err)
      res.render('index', { title: 'AlmosLataan Home' });
    });
});

// router.get('/logout', function (req, res) {
  
//   req.session.destroy
//   // const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(req.session.destroy)});
  
//   // promise.then((data:any) => {
//   //   res.render('index', { title: 'AlmosLataan Home' });
//   // });
// });

  // Export the router
export = router;

