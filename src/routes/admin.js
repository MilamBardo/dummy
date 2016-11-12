/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const ImageRepository = require('../repositories/imageRepository');
const GalleryRepository = require('../repositories/galleryRepository');
const Images = require('../models/Images/ImagesModule');
const expresssession = require('express-session');
const Promise = require('es6-promise');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let router = express.Router();
router.get('/', (req, res) => {
    try {
        displayadminpanel(req, res);
    }
    catch (err) {
        throw new Error("caught an error");
    }
});
function displayadminpanel(req, res) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        //load gallery list
        let galleryRepos = new GalleryRepository.galleryRepository();
        const promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getallgalleries()); });
        promise.then((galleryresult) => {
            res.render('admin/adminpanel', { title: 'AlmosLataan Admin', galleries: galleryresult });
            promise.catch((err) => {
                throw err;
            });
        });
    }
}
router.post('/addportfolioimage', upload.single('file'), (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        let imagecaption = req.body.imagecaption;
        var path = require('path'), fs = require('fs');
        let tempPath = req.file.path;
        let tempBasename = path.basename(tempPath);
        let savePath = /uploads/ + imagename + '.jpg';
        let targetPath = path.resolve('./public/uploads/' + imagename + '.jpg');
        if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {
            var sizeOf = require('image-size');
            sizeOf(tempPath, function (err, dimensions) {
                if (err)
                    throw err;
                var imgwidth = dimensions.width;
                var imgheight = dimensions.height;
                if (imgwidth > 200 && imgheight > 200) {
                    let imageRepos = new ImageRepository.imageRepository();
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err)
                            throw err;
                        let imageinfo = new Images.ImageInfo(imagename, savePath, alttext, imagetitle, imgheight, imgwidth);
                        const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                        promise.then((imageresult) => {
                            displayadminpanel(req, res);
                            promise.catch((err) => {
                                throw err;
                            });
                        });
                    });
                }
            });
        }
        else {
            fs.unlink(tempPath, function (err) {
                if (err)
                    throw err;
                console.error("Only .jpg files are allowed!");
            });
        }
    }
});
router.get('/addnewgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        res.render('portfolio/addnewgallery', { loggedin: loggedin, isadmin: isadmin });
    }
    else {
        //probably been logged out
        displayadminpanel(req, res);
    }
});
router.post('/addnewgallery', (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let galleryname = req.body.galleryname;
        let galleryisprivate = req.body.galleryisprivate;
        let galleryisdefault = req.body.isdefault;
        let galleryRepos = new GalleryRepository.galleryRepository();
        let newgallery = new Images.Gallery(galleryname);
        newgallery.isdefault = galleryisdefault == "on" ? true : false;
        newgallery.isprivate = galleryisprivate == "on" ? true : false;
        if (galleryisdefault) {
            const promisedefault = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.updatedefaultgallerytofalse()); });
            promisedefault.then((galleryid) => {
                const promiseadd = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.addgallery(newgallery)); });
                promiseadd.then((galleryid) => {
                    displayadminpanel(req, res);
                });
                promiseadd.catch((err) => {
                    //PLEASE WRITE A FUCKING ERROR LOG TABLE
                });
            });
            promisedefault.catch((err) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
            });
        }
        else {
            const promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.addgallery(newgallery)); });
            promise.then((galleryid) => {
                displayadminpanel(req, res);
            });
            promise.catch((err) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
            });
        }
    }
});
module.exports = router;
//# sourceMappingURL=admin.js.map