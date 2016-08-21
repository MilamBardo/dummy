/// <reference path='./typings/index.d.ts'/>
"use strict";
const path = require('path');
const express = require('express');
// import * as favicon from 'serve-favicon';
// import * as logger from 'morgan';
// import * as cookieParser = 'cookie-parser';
const bodyParser = require('body-parser');
//import * as session from 'express-session';
let app = express();
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use(express.static(__dirname + '/public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'src')));
var pg = require('pg'), session = require('express-session'), pgSession = require('connect-pg-simple')(session);
var PostgreSqlStore = require('connect-pg-simple')(session);
//var app = express();
var sessionOptions = {
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    store: new PostgreSqlStore({
        conString: "postgres://Almos:Talanath5@localhost:5432/Almos"
    })
};
app.set('trust proxy', 1); //allows to pass proxy
app.use(session(sessionOptions));
//var app = require('../../app');
// const promise2 = new Promise.Promise((resolve : any, reject : any) => { resolve(app.use(session(sessionOptions)));});
// promise2.then((data2 :any) => {
//     console.log('Session setting apparently successful');
//     //req.session.save
//     //res.render('index', { title: 'AlmosLataan Home' });
//     //res.render('index', { title: 'AlmosLataan Home' });
// });
// promise2.catch((err : any) => {
//     // This is never called
//     console.log('Something went wrong with session');
// });
const masterRouter = require('./src/routes/index');
//set-up all app.use()
app.use('/', masterRouter);
app.listen(3001);
module.exports = app;
// app.use(session({
//   name: 'server-session-cookie-id',
//   secret: 'my express secret',
//   saveUninitialized: true,
//   resave: true,
//   store: new FileStore()
// }));
// import * as  HM  from'./src/routes/index'
// var homeCon = new HM.HomeControllers.HomeController();
// homeCon.register(app);
//app.listen(3001);
// const Promise = require('es6-promise');
// var pg = require('pg'), session = require('express-session'), pgSession = require('connect-pg-simple')(session);
// var PostgreSqlStore = require('connect-pg-simple')(session);
// //var app = express();
// var sessionOptions = {
//   secret: "secret",
//   resave : true,
//   saveUninitialized : true,
//   store : new PostgreSqlStore({
//     conString:  "postgres://Almos:Talanath5@localhost:5432/Almos"
//   })
// };
// const promise2 = new Promise.Promise((resolve : any, reject : any) => { resolve(app.use(session(sessionOptions)));});
// promise2.then((data2 :any) => {
//     console.log('Session setting apparently successful');
//     //res.render('index', { title: 'AlmosLataan Home' });
// });
// promise2.catch((err : any) => {
//     // This is never called
//     console.log('Something went wrong with session');
// });
// app.get("/", function(req, res){
//   if ( !req.session){
//     console.log("session not set")
//   }else{
//     console.log("session set")
//   }
// res.render('index', { title: 'AlmosLataan Home' });
// });
//let app = express();
// const promise2 = new Promise.Promise((resolve, reject) => {
//     resolve(app.use(session({
//         store: new pgSession({
//             pg: pg,
//             conString: 'postgres://Almos:Talanath5@localhost:5432/Almos'
//         }),
//         secret: "LahraIsAmazing",
//         resave: false,
//         cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days 
//     })));
// });
// promise2.then((data2) => {
//     console.log('Session setting apparently successful');
//     //res.render('index', { title: 'AlmosLataan Home' });
// });
// promise2.catch((err) => {
//     // This is never called
//     console.log('Something went wrong with session');
// });
//module.exports = app;
//# sourceMappingURL=app.js.map