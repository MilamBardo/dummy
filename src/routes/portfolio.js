/// <reference path='../../typings/index.d.ts'/>
"use strict";
const express = require("express");
const ImageRepository = require('../repositories/imageRepository');
const PostRepository = require('../repositories/postRepository');
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
router.post('/addportfolioimage', upload.single('file'), (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let galleryid = req.body.portfoliogalleryid;
        let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        let imagecaption = req.body.imagecaption;
        let sizecontrollingdimension = req.body.sizecontrollingdimension;
        let sizecontrollingpercentage = req.body.sizecontrollingpercentage;
        let galleryorder = req.body.gallerytotal = undefined ? 0 : req.body.gallerytotal;
        galleryorder++;
        var path = require('path'), fs = require('fs');
        let tempPath = req.file.path;
        let tempBasename = path.basename(tempPath);
        let savePath = /uploads/ + imagename + '.jpg';
        let targetPath = path.resolve('./public/uploads/' + imagename + '.jpg');
        if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {
            let imageRepos = new ImageRepository.imageRepository();
            fs.rename(tempPath, targetPath, function (err) {
                if (err)
                    throw err;
                //console.log("Upload completed!");
                let imageinfo = new Images.ImageInfo(imagename, savePath, alttext, imagetitle);
                const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                promise.then((imageresult) => {
                    let galleryimage = new Images.GalleryImage(galleryid, imageresult.imageid, galleryorder, sizecontrollingdimension, sizecontrollingpercentage);
                    if (imagecaption != undefined && imagecaption != null) {
                        galleryimage.galleryimagecaption = imagecaption;
                    }
                    const promise2 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.addgalleryimage(galleryimage)); });
                    promise2.then((galleryimageid) => {
                        // const promiseDeleteTemp = new Promise.Promise((resolve:any, reject:any) => { resolve(deleteFile("./uploads/"+tempBasename)); });
                        // promiseDeleteTemp.then((filedeleted:any) => {
                        displayMainPortfolio(req, res);
                        // });
                        // promise2.catch((err : any) => {
                        //     displayMainPortfolio(req,res);
                        // });
                    });
                    promise2.catch((err) => {
                        throw err;
                    });
                    promise.catch((err) => {
                        throw err;
                    });
                });
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
router.get('/editportfolioimage', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let imageid = req.query.imageid;
    let imagefilepath = req.query.imagefilepath;
    let galleryimageid = req.query.galleryimageid;
    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getgalleryimagebygalleryimageid(galleryimageid)); });
    promise.then((galleryimage) => {
        res.render('portfolio/editportfolioimage', { title: 'AlmosLataan Portfolio Image Edit', loggedin: loggedin, isadmin: isadmin, galleryimage: galleryimage });
    });
    promise.catch((err) => {
        throw err;
    });
});
router.post('/editportfolioimage', (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryimageid = req.body.galleryimageid;
    let galleryimagecaption = req.body.galleryimagecaption;
    let galleryimageordernumber = req.body.galleryimageordernumber;
    let sizecontrollingdimension = req.body.sizecontrollingdimension;
    let sizecontrollingpercentage = req.body.sizecontrollingpercentage;
    let alttext = req.body.alttext;
    let imagetitle = req.body.imagetitle;
    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getgalleryimagebygalleryimageid(galleryimageid)); });
    promise.then((galleryimage) => {
        galleryimage.galleryimagecaption = galleryimagecaption;
        galleryimage.galleryimageordernumber = galleryimageordernumber;
        galleryimage.sizecontrollingdimension = sizecontrollingdimension;
        galleryimage.sizecontrollingpercentage = sizecontrollingpercentage;
        const promiseUpdate = new Promise.Promise((resolve, reject) => { resolve(imageRepos.updategalleryimage(galleryimage)); });
        promiseUpdate.then((galleryimage) => {
            //Now fecth and update image info as alt text may have been changed
            const promiseFetchImageInfo = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimageinfobyimageid(galleryimage.imageid)); });
            promiseFetchImageInfo.then((fetchedimage) => {
                //Update alttext
                fetchedimage.imagealt = alttext;
                fetchedimage.imagetitle = imagetitle;
                const promiseUpdateImageInfo = new Promise.Promise((resolve, reject) => { resolve(imageRepos.updateimageinfo(fetchedimage)); });
                promiseUpdateImageInfo.then((updatedimage) => {
                    displayMainPortfolio(req, res);
                });
                promiseUpdateImageInfo((err) => {
                    throw err;
                });
            });
            promiseFetchImageInfo((err) => {
                throw err;
            });
        });
        promiseUpdate((err) => {
            throw err;
        });
    });
    promise.catch((err) => {
        throw err;
    });
});
router.post('/deleteportfolioimage', (req, res, next) => {
    let imageid = req.body.imageid;
    let imagefilepath = req.body.imagefilepath;
    let galleryimageid = req.body.galleryimageid;
    //Delete:
    //ImageInfo
    //GalleryImage
    //Thumbnails
    let imageRepos = new ImageRepository.imageRepository();
    //This should really all be in a transaction
    const promise2 = new Promise.Promise((resolve, reject) => { resolve(deleteFile("./public" + imagefilepath)); });
    promise2.then((filedeleted) => {
        //delete gallery image
        const promise3 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.deletegalleryimage(galleryimageid)); ; });
        promise3.then((gideleted) => {
            //delete imageinfo
            const promise4 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.deleteimageinfo(imageid)); ; });
            promise4.then((imagedeleted) => {
                let postRepos = new PostRepository.postRepository();
                const promiseDeletePostImages = new Promise.Promise((resolve, reject) => { resolve(postRepos.deletepostimagesbyimageid(imageid)); ; });
                promiseDeletePostImages.then((postimagesdeleted) => {
                    //reload gallery
                    displayMainPortfolio(req, res);
                });
                promiseDeletePostImages.catch((err) => {
                    throw err;
                });
            });
            promise4.catch((err) => {
                throw err;
            });
        });
        promise3.catch((err) => {
            throw err;
        });
    });
    promise2.catch((err) => {
        throw err;
    });
});
function deleteFile(filepath) {
    const fs = require('fs');
    fs.unlinkSync(filepath);
}
function displayMainPortfolio(req, res) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getdefaultgallery()); });
    promise.then((gallery) => {
        if (gallery == null) {
            //No default gallery set yet, so insert one
            let defaultgallery = new Images.Gallery("Featured");
            defaultgallery.isdefault = true;
            const promise2 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.addgallery(defaultgallery)); });
            promise2.then((galleryid) => {
                defaultgallery.galleryid = galleryid;
                res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio', loggedin: loggedin, isadmin: isadmin, mainportfolio: defaultgallery });
            });
            promise.catch((err) => {
            });
        }
        else {
            const promise2 = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimagesbygalleryid(gallery.galleryid)); });
            promise2.then((galleryimages) => {
                //might be null
                gallery.galleryimages = galleryimages;
                let gallerytotal = galleryimages.length;
                res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio', loggedin: loggedin, isadmin: isadmin, mainportfolio: gallery, gallerytotal: gallerytotal });
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