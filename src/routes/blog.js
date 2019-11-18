"use strict";
/// <reference path='../../typings/index.d.ts'/>
const express = require("express");
const PostRepository = require("../repositories/postRepository");
const ImageRepository = require("../repositories/imageRepository");
const AdvertisementRepository = require("../repositories/advertisementRepository");
const Posts = require("../models/Posts/PostsModule");
const Ads = require("../models/Advertisements/AdvertisementsModule");
const expresssession = require('express-session');
const Promise = require('es6-promise');
let router = express.Router();
router.get('/', (req, res) => {
    try {
        displayBlog(req, res, new Date(), true);
    }
    catch (err) {
        throw new Error("caught an error");
    }
});
router.get('/getnextpage/:startdate', (req, res) => {
    try {
        var startdate = new Date(req.params.startdate);
        displayBlog(req, res, startdate, true);
    }
    catch (err) {
        throw new Error("caught an error");
    }
});
router.get('/getpreviouspage/:previousstartdate/', (req, res) => {
    try {
        var startdate = new Date(req.params.previousstartdate);
        displayBlog(req, res, startdate, false);
    }
    catch (err) {
        throw new Error("caught an error");
    }
});
//reoutes needed
router.get('/:posttitle/:postnumber/', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let title = req.params.posttitle;
    let postnumber = req.params.postnumber;
    if (title = "viewpost") {
        let suppliedpostid = +postnumber;
        let postRepos = new PostRepository.postRepository();
        const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
        promise.then((post) => {
            const promisePostImages = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostimagesbypostid(suppliedpostid)); });
            promisePostImages.then((imagedata) => {
                let mainimage = null;
                let mainimagefilepath = null;
                if (imagedata != null && imagedata.length > 0) {
                    mainimage = imagedata[0];
                    mainimagefilepath = "http://almoslataan.com/public/" + imagedata[0].imagefilepath;
                    //mainimagefilepath = imagedata[0].imagefilepath;
                }
                //regeneratesitemap();
                res.render('blog/viewpost', { title: post.posttitle, loggedin: loggedin, isadmin: isadmin, post: post, mainimage: mainimage, mainimagefilepath: mainimagefilepath });
            });
        });
    }
});
router.get('/addpost', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    res.render('blog/addpost', { title: 'AlmosLataan Add New Post', loggedin: loggedin, isadmin: isadmin });
});
router.get('/editpost', (req, res) => {
    if (req.session.username && req.session.userisadmin) {
        let suppliedpostid = req.query.postid;
        let postRepos = new PostRepository.postRepository();
        let imageRepos = new ImageRepository.imageRepository();
        let adsRepos = new AdvertisementRepository.advertisementRepository();
        //This format is due to curretn typescript problems with promise.all.
        const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
        let postimages;
        let post;
        let images;
        let adtypes;
        let adverts;
        let postadverts;
        promise.then((result) => {
            post = result;
            if (postimages == null || postimages.length == 0)
                postimages = null;
            return new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimagesbypostid(suppliedpostid)); });
        })
            .then((result) => {
            postimages = result;
            return new Promise.Promise((resolve, reject) => { resolve(imageRepos.getallimages()); });
        })
            .then((result) => {
            images = result;
            return new Promise.Promise((resolve, reject) => { resolve(adsRepos.getalladvertisementtypes()); });
        })
            .then((result) => {
            adtypes = result;
            return new Promise.Promise((resolve, reject) => { resolve(adsRepos.getalladvertisements()); });
        })
            .then((result) => {
            adverts = result;
            return new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostadvertisementsforselect(suppliedpostid)); });
        })
            .then((result) => {
            postadverts = result;
            res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, postimages: postimages, portfolioimages: images, adverttypes: adtypes, adverts: adverts, postadverts: postadverts });
        });
        promise.catch((err) => {
            displayBlog(req, res, null, true);
        });
    }
});
// router.get('/editpost', (req, res) => {
//     if (req.session.username && req.session.userisadmin)
//     {
//         let suppliedpostid = req.query.postid;
//         let postRepos = new PostRepository.postRepository();
//         const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
//         promise.then((post:Posts.Post) => {
//             let imageRepos = new ImageRepository.imageRepository();
//                 const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getimagesbypostid(suppliedpostid)); });
//                 promise2.then((postimages:any) => { 
//                     const promise3 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getallimages()); });
//                     promise3.then((images:any) => {
//                         if (postimages == null || postimages.length == 0) postimages=null;
//                         res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, postimages: postimages, portfolioimages: images});
//                     });
//                     promise3.catch((err : any) => {
//                         displayBlog(req, res);
//                     });
//                 });
//                 promise2.catch((err : any) => {
//                     displayBlog(req, res);
//             });
//         });
//         promise.catch((err : any) => {
//             displayBlog(req, res);
//         });
//     }
// });
router.post('/editpost', (req, res, next) => {
    let suppliedpostid = req.body.postid;
    let suppliedposttitle = req.body.posttitle;
    let suppliedposrexcerpt = req.body.postexcerpt;
    let suppliedpostbody = req.body.postbody;
    let associatedpostimageid = req.body.associatedpostimage;
    let currentpostimageid = req.body.currentpostimage;
    let imagecaption = req.body.imagecaption;
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getpostbyid(suppliedpostid)); });
    promise.then((post) => {
        //TEMP while we figure out how to use classes properly
        post.setPostTitle(suppliedposttitle);
        post.postbody = suppliedpostbody;
        post.postexcerpt = suppliedposrexcerpt;
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
                        var newdate = new Date();
                        displayBlog(req, res, newdate, true);
                    });
                    promiseDeletePostImage.catch((err) => {
                        var newdate = new Date();
                        displayBlog(req, res, newdate, true);
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
                            var newdate = new Date();
                            displayBlog(req, res, newdate, true);
                        });
                        promiseUpdatePostImage.catch((err) => {
                            var newdate = new Date();
                            displayBlog(req, res, newdate, true);
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
                    var newdate = new Date();
                    displayBlog(req, res, newdate, true);
                });
                promiseInsertPostImage.catch((err) => {
                    displayBlog(req, res, new Date(), true);
                });
            }
            else {
                regeneratesitemap();
                var newdate = new Date();
                displayBlog(req, res, newdate, true);
            }
        });
        promiseUpdate.catch((err) => {
            res.render('blog/editpost', { title: 'AlmosLataan Edit Post', loggedin: true, isadmin: true, post: post, alertmessage: "Problem saving post" });
        });
    });
    promise.catch((err) => {
        displayBlog(req, res, new Date(), true);
    });
});
router.post('/addpost', (req, res, next) => {
    let suppliedposttitle = req.body.posttitle;
    let suppliedpostexcerpt = req.body.postexcerpt;
    let suppliedpostbody = req.body.postbody;
    let newPost = new Posts.Post(suppliedposttitle, suppliedpostbody, suppliedpostexcerpt);
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.add(newPost)); });
    promise.then((data) => {
        regeneratesitemap();
        var newdate = new Date();
        displayBlog(req, res, newdate, true);
    });
    promise.catch((err) => {
        res.render('index', { title: 'AlmosLataan' });
    });
});
//JSON methods
router.post('/addAdvert', (req, res) => {
    try {
        if (req.body) {
            let advertname = req.body[0].advertname;
            let adverthtml = req.body[0].adverthtml;
            let adverttype = req.body[0].adverttype;
            let advert = new Ads.Advertisement(advertname, adverthtml, adverttype);
            let adRepos = new AdvertisementRepository.advertisementRepository();
            const promise = new Promise.Promise((resolve, reject) => { resolve(adRepos.addadvertisement(advert)); });
            promise.then((result) => {
                //might be null
                let success = false;
                if (result != null && result.advertisementid > 0)
                    success = true;
                if (success) {
                    advert.advertisementid = result.advertisementid;
                    res.setHeader("Content-Type", "text/json");
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.end(JSON.stringify(advert));
                }
                else {
                    res.setHeader("Content-Type", "text/json");
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.end(JSON.stringify("advert addition was a failue"));
                }
            });
        }
    }
    catch (e) {
        //should really log first;
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let errorstring = e.message;
        res.end(JSON.stringify("error when adding amazonad" + errorstring));
    }
});
router.post('/addAdvertToPost', (req, res) => {
    try {
        if (req.body) {
            let postid = req.body[0].postid;
            let advertid = req.body[0].advertid;
            let position = req.body[0].position;
            let postadvert = new Posts.PostAdvertisement(postid, advertid, position);
            let postRepos = new PostRepository.postRepository();
            const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.addpostadvertisement(postadvert)); });
            promise.then((result) => {
                //might be null
                let success = false;
                if (result != null && result.advertisementid > 0)
                    success = true;
                if (success) {
                    postadvert.postadvertisementid = result.postadvertisementid;
                    res.setHeader("Content-Type", "text/json");
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.end(JSON.stringify(postadvert));
                }
                else {
                    res.setHeader("Content-Type", "text/json");
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.end(JSON.stringify("postadvert addition was a failue"));
                }
            });
        }
    }
    catch (e) {
        //should really log first;
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let errorstring = e.message;
        res.end(JSON.stringify("error when adding postadvert" + errorstring));
    }
});
router.post('/addAdvertToPost', (req, res) => {
    try {
        if (req.body) {
            let postid = req.body[0].postid;
            let advertid = req.body[0].postid;
            let position = req.body[0].position;
            let postadvert = new Posts.PostAdvertisement(postid, advertid, position);
        }
    }
    catch (e) {
        //should really log first;
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let errorstring = e.message;
        res.end(JSON.stringify("error when adding advert to post" + errorstring));
    }
});
///Will fetch blog entries and render
function displayBlog(req, res, startdate, greaterthanstartdate) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let postRepos = new PostRepository.postRepository();
    if (greaterthanstartdate) {
        startdate.setSeconds(startdate.getSeconds() + 1);
    }
    else {
        startdate.setSeconds(startdate.getSeconds() - 1);
    }
    //var datei = new Date();
    //var n = datelessthan.toISOString();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getposts(11, startdate, greaterthanstartdate)); });
    promise.then((data) => {
        var blogPosts = data;
        if (blogPosts != null) {
            for (var item of blogPosts) {
                let max = 1500;
                if (item.postbody.length < 1499) {
                    max = item.postbody.length;
                }
                item.postbody = item.postbody.substring(0, max);
                item.postbody = item.postbody + "...";
            }
        }
        let morepostsavailable = false;
        //let lastpostdate : Date = null;
        var lastpostdate = null;
        if (data != null && data.length == 11) {
            morepostsavailable = true;
            lastpostdate = greaterthanstartdate ? blogPosts[9].posttimestamp : blogPosts[0].posttimestamp;
            //.toISOString();
            //removes last value from array so that lastpostdate will represent 10th item.
            blogPosts.pop();
        }
        res.render('blog/blog', { title: 'AlmosLataan Blog', loggedin: loggedin, isadmin: isadmin, posts: blogPosts, morepostsavailable: morepostsavailable, startdate: lastpostdate, previousstartdate: startdate });
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
    let postRepos = new PostRepository.postRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(postRepos.getallposts()); });
    promise.then((posts) => {
        for (var post of posts) {
            var moment = require('moment');
            let postdate = post.postdate;
            let posturl = post.posturl != null ? post.posturl : post.posttitle;
            let datestring = moment(postdate).format('YYYY-MM-DD');
            let blogpost = '<url><loc>https://almoslataan.com/' + posturl + '-' + post.id.toString() + '</loc><lastmod>' + datestring + '</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>';
            sitemapstring = sitemapstring + blogpost;
        }
        let frontpage = '<url><loc>https://almoslataan.com/</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>';
        let portfolio = '<url><loc>https://almoslataan.com/portfolio</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>';
        //let blog : string = '<url><loc>https://almoslataan.com/blog</loc><lastmod>2016-09-27</lastmod><changefreq>weekly</changefreq><priority>0.4</priority></url>'
        let store = '<url><loc>https://almoslataan.com/store</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>';
        let about = '<url><loc>https://almoslataan.com/contact</loc><lastmod>2016-09-27</lastmod><changefreq>monthly</changefreq><priority>0.1</priority></url>';
        sitemapstring = sitemapstring + frontpage;
        sitemapstring = sitemapstring + portfolio;
        //sitemapstring = sitemapstring + blog;
        sitemapstring = sitemapstring + store;
        sitemapstring = sitemapstring + about;
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