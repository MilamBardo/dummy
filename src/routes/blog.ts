/// <reference path='../../typings/index.d.ts'/>

import * as express from "express";
import * as PostRepository from '../repositories/postRepository';
import * as Posts from '../models/Posts/Post';
const expresssession = require('express-session');
const Promise = require('es6-promise');
let router = express.Router();
        
router.get('/', (req, res) => {
    let postRepos = new PostRepository.postRepository();
    
    const promise = new Promise.Promise((resolve : any, reject : any) => { resolve(postRepos.findmostrecentposts(10)); });
    
    promise.then((data : any) => {
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
    promise.catch((err : any) => {
      // This is never called
      console.log('No posts due to error');
  });

});

router.get('/addpost', (req, res) => {
    if (req.session.username && req.session.userisadmin)
    {
        res.render('addpost', { title: 'AlmosLataan Add New Post' });
    }
});

router.post('/addpost', (req:any, res:any, next: any) =>{
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;

    let newPost = new Posts.Posts.Post(suppliedposttitle, suppliedpostbody);
    let postRepos = new PostRepository.postRepository();

    const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(postRepos.add(newPost)); });
    
    promise.then((data:any) => {
        if (req.session.username && req.session.userisadmin)
            {
                res.render('blog', { title: 'AlmosLataan Blog', loggedin: true, isadmin: true });
            }
            else
            {
                res.render('index', { title: 'AlmosLataan Blog' });
            }
    });
    promise.catch((err : any) => {
        res.render('index', { title: 'AlmosLataan Blog' });
    });
});



export= router;
