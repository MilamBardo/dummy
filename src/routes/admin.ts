/// <reference path='../../typings/index.d.ts'/>

import * as express from "express";
import * as PostRepository from '../repositories/postRepository';
import * as ImageRepository from '../repositories/imageRepository';
import * as GalleryRepository from '../repositories/galleryRepository';
import * as Posts from '../models/Posts/PostsModule';
import * as Images from '../models/Images/ImagesModule';

const expresssession = require('express-session');
const Promise = require('es6-promise');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

let router = express.Router();
        
router.get('/', (req, res) => {
    try{
        displayadminpanel(req,res, null)
    }
    catch (err)
    {
        throw new Error("caught an error")
    }

});

function displayadminpanel(req : any, res : any, err : string)
{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        //load gallery list
        let galleryRepos = new GalleryRepository.galleryRepository();
        const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.getallgalleries()); });
            promise.then((galleryresult:any) => {
                        
                res.render('admin/adminpanel', { title: 'AlmosLataan Admin', galleries: galleryresult, errmsg:err });
            promise.catch((err : any) => {
                throw err;
                });
            });
        
    }
}

router.post('/addportfolioimage', upload.single('file'), (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        let imagecaption = req.body.imagecaption;

        var path = require('path'),
        fs = require('fs');

        let tempPath = req.file.path;
        let tempBasename = path.basename(tempPath);
        let savePath = /uploads/ + imagename + '.jpg'
        let targetPath = path.resolve('./public/uploads/'+imagename+'.jpg');
        if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {

            var sizeOf = require('image-size');
                sizeOf(tempPath, function (err : any, dimensions : any) {
                        if (err) throw err;
                        
                        var imgwidth= dimensions.width;
                        var imgheight= dimensions.height;

                        if( imgwidth>200 && imgheight>200)
                        {
                            let imageRepos = new ImageRepository.imageRepository();
                            fs.rename(tempPath, targetPath, function(err : any) {
                                if (err) throw err;

                                let imageinfo = new Images.ImageInfo(imagename, savePath, alttext, imagetitle, imgheight, imgwidth);
                                const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                                    promise.then((imageresult:any) => {
                                                displayadminpanel(req,res, null);
                                    promise.catch((err : any) => {
                                        throw err;
                                        });
                                    });
                                });
                        }

                });
        } 
        else {
            fs.unlink(tempPath, function (err:any) {
                if (err) throw err;
                console.error("Only .jpg files are allowed!");
            });
        }
    }
});

router.get('/addnewgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        res.render('portfolio/addnewgallery', {loggedin : loggedin, isadmin : isadmin})
    }
    else
    {
        //probably been logged out
        displayadminpanel(req,res, "user logged out or not admin")
    }
});

router.post('/addnewgallery', (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let galleryname = req.body.galleryname; 
        let galleryisprivate = req.body.galleryisprivate;
        let galleryisdefault = req.body.isdefault;

        let galleryRepos = new GalleryRepository.galleryRepository();
        let newgallery = new Images.Gallery(galleryname);
        newgallery.isdefault = galleryisdefault == "on" ? true : false;
        newgallery.isprivate = galleryisprivate == "on" ? true : false;

        if (galleryisdefault)
        {
            const promisedefault = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.updatedefaultgallerytofalse());});
            promisedefault.then((galleryid:any) => {
                const promiseadd = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.addgallery(newgallery));});
                promiseadd.then((galleryid:any) => {
                    displayadminpanel(req, res, null);
                });
                promiseadd.catch((err : any) => {
                    //PLEASE WRITE A FUCKING ERROR LOG TABLE
                    });
            });
            promisedefault.catch((err : any) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
            });
        }
        else
        {
            const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.addgallery(newgallery));});
            promise.then((galleryid:any) => {
                displayadminpanel(req, res, null);
            });
            promise.catch((err : any) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
            });
        }

    }
});

router.get('/editgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let galleryid : number = req.body.galleryid;
    let galleryRepos = new GalleryRepository.galleryRepository();

    if (loggedin && isadmin && galleryid != undefined )
    {
        //fetch gallery

        const promiseGetGallery = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.getgallerybyid(galleryid))})
        promiseGetGallery.then((gallery:any) => {
            if (gallery == undefined || gallery == null)
            {
                displayadminpanel(res, req, "Cannot edit gallery as gallery not found");
            }

            const promiseGetGalleryImages = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.getimagesbygalleryid(galleryid))});
            promiseGetGalleryImages.then((galleryimages:any) => {
                //Have all information so display
                res.render('Admin/editgallery', {loggedin : loggedin, isadmin : isadmin, gallery: gallery, galleryimages: galleryimages})
            });

        })
        //fetch gallery pictures

        

        promiseGetGallery.catch((err:any) =>{
            throw err;
        });
    }
    else
    {
        //probably been logged out
        displayadminpanel(req,res, "cannot edit gallery")
    }
});

export= router;