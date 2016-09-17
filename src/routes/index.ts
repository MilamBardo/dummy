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
  var userloggedin = false;
  if (req.session)
  {
    if (req.session.username)
    {
      userloggedin =true;
      
    }
  }
  res.render('contact', { title: 'AlmosLataan Home', loggedin: userloggedin } );
});

router.get('/store', function (req, res) {
  var userloggedin = false;
  if (req.session)
  {
    if (req.session.username)
    {
      userloggedin =true;
    }
  }
  res.render('store', { title: 'AlmosLataan Home', loggedin: userloggedin });
});

// P O S T S
// router.post('/registerprocess', function(req, res, next) {
  router.post('/registerprocess', (req:any, res:any, next: any) =>{

    if (req.body.email != req.body.confirmemail)
    {
      res.render('register', {alertmessage: "Problem when registering:  Emails don't match."});
    }
    else{

          //MUST FIRST CHECK THAT USERNAME IS NOT BEING USED ALREADY
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
                res.render('register', {alertmessage: "Problem when registering, please try again. "});
              });
      });
    }
  });

router.post('/login', (req:any, res:any, next: any) =>{

  try
  {
    
    let suppliedusername = req.body.user;
    let suppliedpassword = req.body.pass;
    let usersRepos = new UserRepository.userRepository();

    const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(usersRepos.findany(suppliedusername)); });
    var bcrypt = require('bcrypt');
    promise.then((data:Users.Users.User) => {

      if (data != null && !data.lockedout)
      {
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
              //Can't access class method - suspicion is that pg-promise isn't returning real objects
              //data.incrementloginattempts(); 
              //SO, TEMP FIX
              data.loginattempts++
              if (data.loginattempts > 3)
              {
                data.lockedout = true
              }
              //NOTICE NO PROMISE
              usersRepos.update(data);
              res.render('login', {alertmessage: "Login details don't match"});
            }
          });
      }
      else if(data.lockedout)
      {
        res.render('login', {alertmessage: "This account is locked out.  Please request unlock. "});
      }
      else
      {
        res.render('login', {alertmessage: "Login details not found"});
      }
    });
    
    promise.catch((err : Error) => {
        // This is never called
        //console.log('I didnt get called:');
        res.render('login', {alertmessage: "Error when logging in "+err.message});
    });
    
  }
  catch (err)
  {
    res.render('login', {alertmessage: "Error when logging in.  Internal issue - please report"});
    //throw err;
  }
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

