/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const GalleryRepository = require('../repositories/galleryRepository');
const Images = require('../models/Images/ImagesModule');
const expresssession = require('express-session');
const Promise = require('es6-promise');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let router = express.Router();
router.get('/', (req, res) => {
    try {
        displayMainPortfolio(req, res);
    }
    catch (err) {
        throw new Error("caught an error");
    }
});
router.get('/addportfolioimage', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let galleryid = req.query.galleryid;
        let gallerytotal = req.query.gallerytotal;
        res.render('portfolio/addportfolioimage', { loggedin: loggedin, isadmin: isadmin, portfoliogalleryid: galleryid, gallerytotal: gallerytotal });
    }
});
router.post('/fetchGallery', (req, res) => {
    try {
        if (req.body) {
            let galleryid = req.body[0].galleryid;
            let galleryRepos = new GalleryRepository.galleryRepository();
            const promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getgallerybyid(galleryid)); });
            promise.then((gallery) => {
                if (gallery != null) {
                    const promise2 = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getimagesbygalleryid(gallery.galleryid)); });
                    promise2.then((galleryimages) => {
                        //might be null
                        gallery.galleryimages = galleryimages;
                        res.setHeader("Content-Type", "text/json");
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.end(JSON.stringify(gallery));
                    });
                    promise2.catch((err) => {
                        res.setHeader("Content-Type", "text/json");
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.end(JSON.stringify("error fetching gallery"));
                    });
                }
                else {
                    res.setHeader("Content-Type", "text/json");
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.end(JSON.stringify("gallery not found"));
                }
            });
            promise.catch((err) => {
                res.setHeader("Content-Type", "text/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify("error fetching gallery"));
            });
        }
    }
    catch (e) {
        //should really log first;
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let errorstring = e.message;
        res.end(JSON.stringify("error when deleting image from gallery" + errorstring));
    }
});
function deleteFile(filepath) {
    const fs = require('fs');
    fs.unlinkSync(filepath);
}
function displayMainPortfolio(req, res) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryRepos = new GalleryRepository.galleryRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getdefaultgallery()); });
    promise.then((gallery) => {
        if (gallery == null) {
            //No default gallery set yet, so insert one
            let defaultgallery = new Images.Gallery("Featured");
            defaultgallery.isdefault = true;
            const promise2 = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.addgallery(defaultgallery)); });
            promise2.then((galleryid) => {
                defaultgallery.galleryid = galleryid;
                res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio', loggedin: loggedin, isadmin: isadmin, mainportfolio: defaultgallery });
            });
            promise2.catch((err) => {
            });
        }
        else {
            const promise2 = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getimagesbygalleryid(gallery.galleryid)); });
            promise2.then((galleryimages) => {
                //might be null
                gallery.galleryimages = galleryimages;
                let gallerytotal = galleryimages.length;
                // let portraits : Array<any> = [];
                // let landscapes : Array<any> = [];
                // for (var item of galleryimages) {
                //     if (item.orientation =="L")
                //     {
                //         landscapes.push(item);
                //     }
                //     else
                //     {
                //         portraits.push(item);
                //     }
                // }
                //res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio',loggedin : loggedin, isadmin : isadmin, landscapes : landscapes, portraits: portraits, mainportfolio : gallery, gallerytotal:gallerytotal});
                //fetch other barebones galleries for display
                const promise3 = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getallgalleries()); });
                promise3.then((allgallerynames) => {
                    res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio', loggedin: loggedin, isadmin: isadmin, mainportfolio: gallery, gallerytotal: gallerytotal, allgallerynames: allgallerynames });
                });
                promise.catch((err) => {
                });
            });
            promise.catch((err) => {
            });
        }
    });
    promise.catch((err) => {
        //displayBlog(req, res);
    });
}
module.exports = router;
//# sourceMappingURL=portfolio.js.map