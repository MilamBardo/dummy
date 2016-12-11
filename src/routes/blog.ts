/// <reference path='../../typings/index.d.ts'/>

import * as express from "express";
import * as PostRepository from '../repositories/postRepository';
import * as ImageRepository from '../repositories/imageRepository';
import * as Posts from '../models/Posts/PostsModule';
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
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    
    res.render('blog/addpost', { title: 'AlmosLataan Add New Post', loggedin: loggedin, isadmin: isadmin });
    
});



router.get('/editpost', (req, res) => {
    if (req.session.username && req.session.userisadmin)
    {
        let suppliedpostid = req.query.postid;
        let postRepos = new PostRepository.postRepository();
        const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
        promise.then((post:Posts.Post) => {
            let imageRepos = new ImageRepository.imageRepository();
                const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getimagesbypostid(suppliedpostid)); });
                promise2.then((postimages:any) => { 
                    const promise3 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getallimages()); });
                    promise3.then((images:any) => {
                        if (postimages.length == 0) postimages=null;
                        res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, postimages: postimages, portfolioimages: images});
                    });
                    promise3.catch((err : any) => {
                        displayBlog(req, res);
                    });
                });
                promise2.catch((err : any) => {
                    displayBlog(req, res);
            });
        });
        promise.catch((err : any) => {
            displayBlog(req, res);
        });
        
    }
});
router.post('/editpost', (req:any, res:any, next: any) =>{
    let suppliedpostid = req.body.postid;
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;
    let associatedpostimageid = req.body.associatedpostimage;
    let currentpostimageid = req.body.currentpostimage;
    let imagecaption = req.body.imagecaption;

    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
        promise.then((post:Posts.Post) => {
            //TEMP while we figure out how to use classes properly
            
            post.setPostTitle(suppliedposttitle);
            post.postbody=suppliedpostbody;

            //UPDATE POST
            const promiseUpdate = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.updatepost(post)); });
            promiseUpdate.then((postupdated:any) => {

                //NOW FOR IMAGE
                //if already exists and now null -> update as deleted
                //if already exists and now changed -> update imageid
                //if does not already exist, insert
                
                if (currentpostimageid != null)
                {
                    
                        if (associatedpostimageid == null || associatedpostimageid == "none")
                        {
                            // DELETE
                            const promiseDeletePostImage = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.deletepostimage(currentpostimageid)); });
                            promiseDeletePostImage.then((deletedpostimage:any) => {
                                regeneratesitemap();
                                displayBlog(req, res);
                            });
                            promiseDeletePostImage.catch((err : any) => {
                                displayBlog(req, res);
                            });
                        }
                        else 
                        {
                            const promiseFetchPostImage = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getpostimagebypostimageid(currentpostimageid)); });
                            promiseFetchPostImage.then((fetchedpostimage:any) => {
                                //change
                                fetchedpostimage.imageid = associatedpostimageid;
                                fetchedpostimage.postimagecaption = imagecaption;

                                //Now UPDATE
                                const promiseUpdatePostImage = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.updatepostimage(fetchedpostimage)); });
                                promiseUpdatePostImage.then((fetchedpostimage:any) => {
                                    regeneratesitemap();
                                    displayBlog(req, res);
                                });
                                promiseUpdatePostImage.catch((err : any) => {
                                    displayBlog(req, res);
                                });
                            });
                            promiseFetchPostImage.catch((err : any) => {
                                    throw err;
                            });
                        }
                        

                    
                }
                else if (associatedpostimageid != "none")
                {
                    //INsert Post IMage
                        let postimagenew = new Posts.PostImage(suppliedpostid, associatedpostimageid);
                        postimagenew.postimagecaption = imagecaption;
                        const promiseInsertPostImage = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.addpostimage(postimagenew)); });
                        promiseInsertPostImage.then((postimageresult:any) => {
                            regeneratesitemap();
                            displayBlog(req, res);
                        });
                        promiseInsertPostImage.catch((err : any) => {
                            displayBlog(req, res);
                        });
                }
                else
                {
                    regeneratesitemap();
                  displayBlog(req, res);  
                }

            });
            promiseUpdate.catch((err : any) => {
                res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, alertmessage:"Problem saving post" });
            });
        });
        promise.catch((err : any) => {
            displayBlog(req, res);
        });
        
});

router.post('/addpost', (req:any, res:any, next: any) =>{
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostbody = req.body.postbody;

    let newPost = new Posts.Post(suppliedposttitle, suppliedpostbody);
    let postRepos = new PostRepository.postRepository();

    const promise = new Promise.Promise((resolve :any , reject : any) => { resolve(postRepos.add(newPost)); });
    
    promise.then((data:any) => {
        regeneratesitemap();
        displayBlog(req, res);
    });
    promise.catch((err : any) => {
        res.render('index', { title: 'AlmosLataan' });
    });
});

///Will fetch blog entries and render
function displayBlog (req: any, res: any)
{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getmostrecentposts(10)); });
    promise.then((data:any) => {
        var blogPosts = data;
        for (var item of blogPosts)
        {
            let max = 1500;
            if (item.postbody.length < 1499)
            {
                max = item.postbody.length;
            }
            item.postbody = item.postbody.substring(0, max);
            item.postbody = item.postbody +"..."
        }
        res.render('blog/blog', { title: 'AlmosLataan Blog', loggedin: loggedin, isadmin: isadmin, posts: blogPosts });
        
    });
    promise.catch((err:Error) => {
        // This is never called
        //console.log('No posts due to error');
        res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues'+err.message+err.stack.toString });
    });
}

function regeneratesitemap()
{
    //Delete old sitemap
    //const fis = require('fs');
    //fis.unlinkSync(filepath);

    //build sitemapstring
    let sitemapstring : string ="";
    sitemapstring += '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    

    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getallposts()); });
    promise.then((posts:any) => {
        for (var post of posts)
        {
            var moment = require('moment');
            let postdate : Date = post.postdate;
            let posturl = post.posturl != null ? post.posturl : post.posttitle;
            let datestring = moment(postdate).format('YYYY-MM-DD');
            let blogpost = '<url><loc>http://almoslataan.com/'+posturl+'/'+post.id.toString()+'</loc><lastmod>'+datestring+'</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>'
            sitemapstring = sitemapstring + blogpost;

            
        }
        let frontpage : string = '<url><loc>http://almoslataan.com/</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>'
        let portfolio : string = '<url><loc>http://almoslataan.com/portfolio</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>'
        let blog : string = '<url><loc>http://almoslataan.com/blog</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>'
        let store : string = '<url><loc>http://almoslataan.com/store</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>'
        let about : string = '<url><loc>http://almoslataan.com/contact</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>'
        
        sitemapstring = sitemapstring + frontpage;
        sitemapstring = sitemapstring + portfolio;
        sitemapstring = sitemapstring + blog;
        sitemapstring = sitemapstring + store;
        sitemapstring = sitemapstring + about;
        sitemapstring = sitemapstring +'</urlset>';
        //Create new sitemap
            var fs = require('fs');
            fs.writeFile("./public/sitemap.xml", sitemapstring, function(err : any) {
                if(err) {
                    return console.log(err);
                }
            });
    });
    promise.catch((err:Error) => {
        throw err;
        //res.render('blog/blog', { title: 'AlmosLataan Blog', alertmessage: 'Problem loading blog.  Please contact if issue continues'+err.message+err.stack.toString });
    });
}



export= router;
