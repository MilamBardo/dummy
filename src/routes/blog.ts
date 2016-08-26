/// <reference path='../../typings/index.d.ts'/>

import * as express from "express";
import * as PostRepository from '../repositories/postRepository';
import * as Posts from '../models/Posts/Post';
const expresssession = require('express-session');
const Promise = require('es6-promise');
let router = express.Router();
        
router.get('/', (req, res) => {
    try{
        displayBlog(req,res)
    }
    catch (err)
    {
        throw new Error("caught an error")
    }

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
        displayBlog(req, res);
    });
    promise.catch((err : any) => {
        res.render('index', { title: 'AlmosLataan Blog' });
    });
});

///Will fetch blog entries and render
function displayBlog (req: any, res: any)
{
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.findmostrecentposts(10)); });
    promise.then((data:any) => {
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
    promise.catch((err:Error) => {
        // This is never called
        //console.log('No posts due to error');
        res.render('blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues'+err.message+err.stack.toString });
    });
}

export= router;
