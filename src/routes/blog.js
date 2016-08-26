/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const PostRepository = require('../repositories/postRepository');
const Posts = require('../models/Posts/Post');
const expresssession = require('express-session');
const Promise = require('es6-promise');
let router = express.Router();
router.get('/', (req, res) => {
    try {
        displayBlog(req, res);
    }
    catch (err) {
        throw new Error("caught an error");
    }
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
        displayBlog(req, res);
    });
    promise.catch((err) => {
        res.render('index', { title: 'AlmosLataan Blog' });
    });
});
///Will fetch blog entries and render
function displayBlog(req, res) {
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
        //console.log('No posts due to error');
        res.render('blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues' + err.message + err.stack.toString });
    });
}
module.exports = router;
//# sourceMappingURL=blog.js.map