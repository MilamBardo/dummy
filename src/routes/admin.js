"use strict";
/// <reference path='../../typings/index.d.ts'/>
const express = require("express");
const ImageRepository = require("../repositories/imageRepository");
const GalleryRepository = require("../repositories/galleryRepository");
const Images = require("../models/Images/ImagesModule");
const expresssession = require('express-session');
const Promise = require('es6-promise');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let router = express.Router();
router.get('/', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        try {
            displayadminpanel(req, res, null);
        }
        catch (err) {
            throw new Error("caught an error");
        }
    }
    else {
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
    }
});
function displayadminpanel(req, res, err) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        //load gallery list
        let galleryRepos = new GalleryRepository.galleryRepository();
        let imageRepos = new ImageRepository.imageRepository();
        const promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getallgalleries()); });
        promise.then((galleryresult) => {
            const promiseImages = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getallimages()); });
            promiseImages.then((imagelist) => {
                res.render('admin/adminpanel', { title: 'AlmosLataan Admin', galleries: galleryresult, imagelist: imagelist, errmsg: err });
            });
        });
        promise.catch((err) => {
            throw err;
        });
    }
    else {
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
    }
}
router.post('/uploadimage', upload.single('file'), (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    try {
        if (loggedin && isadmin) {
            let imagename = req.body.imagename;
            let alttext = req.body.alttext;
            let imagetitle = req.body.imagetitle;
            let imagecaption = req.body.imagecaption;
            let imagebuylink = req.body.imagebuylink;
            var path = require('path'), fs = require('fs');
            let tempPath = req.file.path;
            let tempBasename = path.basename(tempPath);
            let savePath = /uploads/ + imagename + '.jpg';
            //LOCAL
            let targetPath = path.resolve('./public/uploads/' + imagename + '.jpg');
            //LIVE
            //let targetPath = path.resolve('./apps/Almos/public/uploads/'+imagename+'.jpg');
            if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {
                var sizeOf = require('image-size');
                //sizeOf(tempPath, function (err : any, dimensions : any) {
                //if (err) throw err;
                var dimensions = sizeOf(tempPath);
                var imgwidth = dimensions.width;
                var imgheight = dimensions.height;
                if (imgwidth > 200 && imgheight > 200) {
                    let imageRepos = new ImageRepository.imageRepository();
                    //displayadminpanel(req,res, "pastimageRepos. temppath="+tempPath+" targetpath="+targetPath);
                    fs.rename(tempPath, targetPath, function (err) {
                        // if (err) throw err;
                        //displayadminpanel(req,res, "past fs rename. temppath="+tempPath+" targetpath="+targetPath);
                        let imageinfo = new Images.ImageInfo(imagename, savePath, alttext, imagetitle, imgheight, imgwidth, imagebuylink);
                        const promise = new Promise.Promise((resolve, reject) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                        promise.then((imageresult) => {
                            displayadminpanel(req, res, null);
                            promise.catch((err) => {
                                //                 //throw err;
                                displayadminpanel(req, res, "error on sql addimageinfo");
                            });
                        });
                    });
                }
                else {
                    displayadminpanel(req, res, "image width and height not greater than");
                }
                //});
            }
            else {
                fs.unlink(tempPath, function (err) {
                    if (err)
                        throw err;
                    console.error("Only .jpg files are allowed!");
                });
                displayadminpanel(req, res, "path not equal to jpg");
            }
        }
        else {
            displayadminpanel(req, res, "either notlogged in or not admin");
        }
    }
    catch (error) {
        displayadminpanel(req, res, "error caught");
    }
});
router.get('/editimage', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let imageid = req.query.imagelist;
        let imageRepos = new ImageRepository.imageRepository();
        const promiseGet = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimageinfobyimageid(imageid)); });
        promiseGet.then((imageinfo) => {
            res.render('admin/editimage', { loggedin: loggedin, isadmin: isadmin, image: imageinfo });
        });
        promiseGet.catch((err) => {
            //PLEASE WRITE A FUCKING ERROR LOG TABLE
            throw err;
        });
    }
    else {
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
    }
});
router.post('/editimage', upload.single('file'), (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        let imageid = req.body.imageid;
        //let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        //let imagecaption = req.body.imagecaption;
        let imagebuylink = req.body.imagebuylink;
        let imageRepos = new ImageRepository.imageRepository();
        const promiseGet = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getimageinfobyimageid(imageid)); });
        promiseGet.then((masterimage) => {
            masterimage.imagealt = alttext;
            masterimage.imagetitle = imagetitle;
            masterimage.imagebuylink = imagebuylink;
            const promiseUpdate = new Promise.Promise((resolve, reject) => { resolve(imageRepos.updateimageinfo(masterimage)); });
            promiseUpdate.then((result) => {
                displayadminpanel(req, res, masterimage.imagename + "updated");
            });
            promiseUpdate.catch((err) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
                throw err;
            });
        });
        promiseGet.catch((err) => {
            //PLEASE WRITE A FUCKING ERROR LOG TABLE
            throw err;
        });
    }
});
router.get('/addnewgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    if (loggedin && isadmin) {
        res.render('admin/addnewgallery', { loggedin: loggedin, isadmin: isadmin });
    }
    else {
        //probably been logged out
        displayadminpanel(req, res, "user logged out or not admin");
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
                    displayadminpanel(req, res, null);
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
                displayadminpanel(req, res, null);
            });
            promise.catch((err) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
            });
        }
    }
});
router.post('/editgallery', (req, res, next) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryid = req.body.galleryid;
    let galleryname = req.body.galleryname;
    let galleryisprivate = req.body.galleryisprivate == "on" ? true : false;
    ;
    let isdefault = req.body.isdefault == "on" ? true : false;
    ;
    let galleryRepos = new GalleryRepository.galleryRepository();
    let imageRepos = new ImageRepository.imageRepository();
    if (loggedin && isadmin && galleryid != undefined) {
        //fetch gallery
        const promiseGetGallery = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getgallerybyid(galleryid)); });
        promiseGetGallery.then((gallery) => {
            if (gallery) {
                gallery.galleryname = galleryname;
                gallery.isdefault = isdefault;
                gallery.isprivate = galleryisprivate;
                const promiseUpdate = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.updategallery(gallery)); });
                promiseUpdate.then((postupdated) => {
                    fetchGallery(req, res, galleryid);
                });
                promiseUpdate.catch((err) => {
                    throw err;
                });
            }
            else {
                //probably been logged out
                displayadminpanel(req, res, "cannot edit gallery");
            }
        });
        promiseGetGallery.catch((err) => {
            throw err;
        });
    }
});
router.get('/editgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryid = req.query.gallerylist;
    if (loggedin && isadmin && galleryid != undefined) {
        //fetch gallery
        fetchGallery(req, res, galleryid);
    }
    else {
        //probably been logged out
        displayadminpanel(req, res, "cannot edit gallery");
    }
});
router.post('/deleteImageFromGallery', (req, res) => {
    try {
        if (req.body) {
            let galleryRepos = new GalleryRepository.galleryRepository();
            let galleryimageid = req.body[0].galleryimageid;
            const promisedeletegalleryimage = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.deletegalleryimage(galleryimageid)); });
            promisedeletegalleryimage.then((result) => {
                res.setHeader("Content-Type", "text/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify("imagedeleted"));
            });
            promisedeletegalleryimage.catch((error) => {
                throw error;
            });
        }
        else {
            throw new Error("no request body provided");
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
//save gallery ajax request
router.post('/saveGallery', (req, res) => {
    try {
        if (req.body) {
            let galleryRepos = new GalleryRepository.galleryRepository();
            var imagearray = req.body;
            //ideally, these should all be in a transaction, but whatever;
            for (var item of imagearray) {
                //first, check whether image has a agllery image yet
                if (item.galleryimageid == "") {
                    //insert galleryimages
                    let gimage = new Images.GalleryImage(item.galleryid, item.imageid, item.galleryimagesortnumber, "width", "50%");
                    gimage.galleryimagecaption = "no info";
                    let promiseInsertGalleryImage = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.addgalleryimage(gimage)); });
                    promiseInsertGalleryImage.catch((err) => {
                        throw err;
                    });
                }
                else {
                    //change order of gallery image
                    //should really fetch from server 1st, but going to skip that and just add a method
                    let promise = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.updategalleryimagesortorderbyid(item.galleryimageid, item.galleryimagesortnumber)); });
                    promise.then((galleryimages) => {
                        //Woopy doo da
                    });
                    promise.catch((err) => {
                        throw err;
                    });
                }
            }
            //success
            res.setHeader("Content-Type", "text/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify(true));
        }
        else {
            res.setHeader("Content-Type", "text/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(JSON.stringify("no data supplied"));
        }
    }
    catch (e) {
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify("exception caught"));
    }
    //res.send(JSON.stringify({ result: true }));
    //Rest of the code
});
router.post('fetchimage', (req, res) => {
    if (req.body) {
        let imageRepos = new ImageRepository.imageRepository();
        var imagearray = req.body;
        var imagerequired = imagearray[0];
        var imageid = imagerequired.imageid;
    }
});
function fetchGallery(req, res, galleryid) {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryRepos = new GalleryRepository.galleryRepository();
    let imageRepos = new ImageRepository.imageRepository();
    const promiseGetGallery = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getgallerybyid(galleryid)); });
    promiseGetGallery.then((gallery) => {
        if (gallery == undefined || gallery == null) {
            displayadminpanel(res, req, "Cannot edit gallery as gallery not found");
        }
        const promiseGetGalleryImages = new Promise.Promise((resolve, reject) => { resolve(galleryRepos.getimagesbygalleryid(galleryid)); });
        promiseGetGalleryImages.then((galleryimages) => {
            //Check for further other Images
            const promiseGetOtherImages = new Promise.Promise((resolve, reject) => { resolve(imageRepos.getallimages()); });
            promiseGetOtherImages.then((otherimages) => {
                let remaining = [];
                for (var oimage of otherimages) {
                    var found = false;
                    for (var gimage of galleryimages) {
                        if (oimage.imageid == gimage.imageid) {
                            found = true;
                        }
                    }
                    if (!found) {
                        remaining.push(oimage);
                    }
                }
                //Have all information so display
                res.render('admin/editgallery', { loggedin: loggedin, isadmin: isadmin, gallery: gallery, galleryimages: galleryimages, otherimages: remaining });
            });
        });
        promiseGetGalleryImages.catch((err) => {
            throw err;
        });
    });
    //fetch gallery pictures
    promiseGetGallery.catch((err) => {
        throw err;
    });
}
module.exports = router;
//# sourceMappingURL=admin.js.map