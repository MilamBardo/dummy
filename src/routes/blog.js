/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const PostRepository = require('../repositories/postRepository');
const ImageRepository = require('../repositories/imageRepository');
const Posts = require('../models/Posts/PostsModule');
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
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    res.render('blog/addpost', { title: 'AlmosLataan Add New Post', loggedin: loggedin, isadmin: isadmin });
});
router.get('/viewpost/:postid', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let suppliedpostid = req.params.postid;
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
    promise.then((data) => {
        var post = data;
        const promisePostImages = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostimagesbypostid(suppliedpostid)); });
        promisePostImages.then((imagedata) => {
            let mainimage = null;
            if (imagedata != null && imagedata.length > 0) {
                mainimage = imagedata[0];
            }
            regeneratesitemap();
            res.render('blog/viewpost', { title: data.posttitle, loggedin: loggedin, isadmin: isadmin, post: post, mainimage: mainimage });
        });
        promisePostImages.catch((err) => {
            // This is never called
            //console.log('No posts due to error');
            res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading post.  Please contact if issue continues' + err.message + err.stack.toString });
        });
    });
    promise.catch((err) => {
        // This is never called
        //console.log('No posts due to error');
        res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading post.  Please contact if issue continues' + err.message + err.stack.toString });
    });
});
router.get('/editpost', (req, res) => {
    if (req.session.username && req.session.userisadmin) {
        let suppliedpostid = req.query.postid;
        let postRepos = new PostRepository.postRepository();
        const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
        promise.then((data) => {
            let imageRepos = new ImageRepository.imageRepository();
            const promise2 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimagesbypostid(suppliedpostid)); });
            promise2.then((postimages) => {
                const promise3 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getallimages()); });
                promise3.then((images) => {
                    if (postimages.length == 0)
                        postimages = null;
                    res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: data, postimages: postimages, portfolioimages: images });
                });
                promise3.catch((err) => {
                    displayBlog(req, res);
                });
            });
            promise2.catch((err) => {
                displayBlog(req, res);
            });
        });
        promise.catch((err) => {
            displayBlog(req, res);
        });
    }
});
router.post('/editpost', (req, res, next) => {
    let suppliedpostid = req.body.postid;
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;
    let associatedpostimageid = req.body.associatedpostimage;
    let currentpostimageid = req.body.currentpostimage;
    let imagecaption = req.body.imagecaption;
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
    promise.then((post) => {
        //TEMP while we figure out how to use classes properly
        post.posttitle = suppliedposttitle;
        post.postbody = suppliedpostbody;
        //UPDATE POST
        const promiseUpdate = new Promise.Promise((resolve, reject) => { resolve(postRepos.updatepost(post)); });
        promiseUpdate.then((postupdated) => {
            //NOW FOR IMAGE
            //if already exists and now null -> update as deleted
            //if already exists and now changed -> update imageid
            //if does not already exist, insert
            if (currentpostimageid != null) {
                if (associatedpostimageid == null || associatedpostimageid == "none") {
                    // DELETE
                    const promiseDeletePostImage = new Promise.Promise((resolve, reject) => { resolve(postRepos.deletepostimage(currentpostimageid)); });
                    promiseDeletePostImage.then((deletedpostimage) => {
                        regeneratesitemap();
                        displayBlog(req, res);
                    });
                    promiseDeletePostImage.catch((err) => {
                        displayBlog(req, res);
                    });
                }
                else {
                    const promiseFetchPostImage = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostimagebypostimageid(currentpostimageid)); });
                    promiseFetchPostImage.then((fetchedpostimage) => {
                        //change
                        fetchedpostimage.imageid = associatedpostimageid;
                        fetchedpostimage.postimagecaption = imagecaption;
                        //Now UPDATE
                        const promiseUpdatePostImage = new Promise.Promise((resolve, reject) => { resolve(postRepos.updatepostimage(fetchedpostimage)); });
                        promiseUpdatePostImage.then((fetchedpostimage) => {
                            regeneratesitemap();
                            displayBlog(req, res);
                        });
                        promiseUpdatePostImage.catch((err) => {
                            displayBlog(req, res);
                        });
                    });
                    promiseFetchPostImage.catch((err) => {
                        throw err;
                    });
                }
            }
            else if (associatedpostimageid != "none") {
                //INsert Post IMage
                let postimagenew = new Posts.PostImage(suppliedpostid, associatedpostimageid);
                postimagenew.postimagecaption = imagecaption;
                const promiseInsertPostImage = new Promise.Promise((resolve, reject) => { resolve(postRepos.addpostimage(postimagenew)); });
                promiseInsertPostImage.then((postimageresult) => {
                    regeneratesitemap();
                    displayBlog(req, res);
                });
                promiseInsertPostImage.catch((err) => {
                    displayBlog(req, res);
                });
            }
            else {
                regeneratesitemap();
                displayBlog(req, res);
            }
        });
        promiseUpdate.catch((err) => {
            res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, alertmessage: "Problem saving post" });
        });
    });
    promise.catch((err) => {
        displayBlog(req, res);
    });
});
router.post('/addpost', (req, res, next) => {
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;
    let newPost = new Posts.Post(suppliedposttitle, suppliedpostbody);
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.add(newPost)); });
    promise.then((data) => {
        regeneratesitemap();
        displayBlog(req, res);
    });
    promise.catch((err) => {
        res.render('index', { title: 'AlmosLataan' });
    });
});
///Will fetch blog entries and render
function displayBlog(req, res) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getmostrecentposts(10)); });
    promise.then((data) => {
        var blogPosts = data;
        for (var item of blogPosts) {
            let max = 1500;
            if (item.postbody.length < 1499) {
                max = item.postbody.length;
            }
            item.postbody = item.postbody.substring(0, max);
            item.postbody = item.postbody + "...";
        }
        res.render('blog/blog', { title: 'AlmosLataan Blog', loggedin: loggedin, isadmin: isadmin, posts: blogPosts });
    });
    promise.catch((err) => {
        // This is never called
        //console.log('No posts due to error');
        res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues' + err.message + err.stack.toString });
    });
}
function regeneratesitemap() {
    //Delete old sitemap
    //const fis = require('fs');
    //fis.unlinkSync(filepath);
    //build sitemapstring
    let sitemapstring = "";
    sitemapstring += '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    let frontpage = '<url><loc>http://almoslataan.com/</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>';
    let portfolio = '<url><loc>http://almoslataan.com/portfolio</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>';
    let blog = '<url><loc>http://almoslataan.com/blog</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>';
    let store = '<url><loc>http://almoslataan.com/store</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>';
    let about = '<url><loc>http://almoslataan.com/about</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>';
    sitemapstring = sitemapstring + frontpage;
    sitemapstring = sitemapstring + portfolio;
    sitemapstring = sitemapstring + blog;
    sitemapstring = sitemapstring + store;
    sitemapstring = sitemapstring + about;
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getallposts()); });
    promise.then((posts) => {
        for (var post of posts) {
            var moment = require('moment');
            let postdate = post.postdate;
            let datestring = moment(postdate).format('YYYY-MM-DD');
            let blogpost = '<url><loc>http://almoslataan.com/blog/viewpost/' + post.id.toString() + '</loc><lastmod>' + datestring + '</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>';
            sitemapstring = sitemapstring + blogpost;
        }
        sitemapstring = sitemapstring + '</urlset>';
        //Create new sitemap
        var fs = require('fs');
        fs.writeFile("./public/sitemap.xml", sitemapstring, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    promise.catch((err) => {
        throw err;
        //res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues'+err.message+err.stack.toString });
    });
}
module.exports = router;
//# sourceMappingURL=blog.js.map