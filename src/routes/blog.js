/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const PostRepository = require('../repositories/postRepository');
const Posts = require('../models/Posts/Post');
const expresssession = require('express-session');
const Promise = require('es6-promise');
let router = express.Router();
router.get('/', (req, res) => {
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.findmostrecentposts(10)); });
    promise.then((data) => {
        var blogPosts = data;
        if (req.session.username && req.session.userisadmin) {
            res.render('blog', { title: 'AlmosLataan Blog', loggedin: true, isadmin: true, posts: blogPosts });
        }
        else if (req.session.username) {
            res.render('blog', { title: 'AlmosLataan Blog', loggedin: true, posts: blogPosts });
        }
        else {
            res.render('blog', { title: 'AlmosLataan Blog', posts: blogPosts });
        }
    });
    promise.catch((err) => {
        // This is never called
        console.log('No posts due to error');
    });
});
router.get('/addpost', (req, res) => {
    if (req.session.username && req.session.userisadmin) {
        res.render('addpost', { title: 'AlmosLataan Add New Post' });
    }
});
router.post('/addpost', (req, res, next) => {
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;
    let newPost = new Posts.Posts.Post(suppliedposttitle, suppliedpostbody);
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.add(newPost)); });
    promise.then((data) => {
        if (req.session.username && req.session.userisadmin) {
            res.render('blog', { title: 'AlmosLataan Blog', loggedin: true, isadmin: true });
        }
        else {
            res.render('index', { title: 'AlmosLataan Blog' });
        }
    });
    promise.catch((err) => {
        res.render('index', { title: 'AlmosLataan Blog' });
    });
});
module.exports = router;
//# sourceMappingURL=blog.js.map