/// <reference path='../../typings/index.d.ts'/>

import * as express from "express";
import * as ImageRepository from '../repositories/imageRepository';
import * as PostRepository from '../repositories/postRepository';
import * as Images from '../models/Images/ImagesModule';

const expresssession = require('express-session');
const Promise = require('es6-promise');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

let router = express.Router();
        
router.get('/', (req, res) => {
    try{
        displayMainPortfolio(req,res)
    }
    catch (err)
    {
        throw new Error("caught an error")
    }

});

router.get('/addportfolioimage', (req, res) => {

    
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let galleryid = req.query.galleryid;
        let gallerytotal = req.query.gallerytotal;
        res.render('portfolio/addportfolioimage', {loggedin, isadmin, portfoliogalleryid : galleryid, gallerytotal:gallerytotal})
    }
});
router.post('/addportfolioimage', upload.single('file'), (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let galleryid = req.body.portfoliogalleryid;
        let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagecaption = req.body.imagecaption;
        let sizecontrollingdimension = req.body.sizecontrollingdimension;
        let sizecontrollingpercentage = req.body.sizecontrollingpercentage;
        let galleryorder : number = req.body.gallerytotal = undefined ? 0 : req.body.gallerytotal;
        galleryorder++;
        var path = require('path'),
        fs = require('fs');

        let tempPath = req.file.path;
        let tempBasename = path.basename(tempPath);
        let savePath = /uploads/ + imagename + '.jpg'
        let targetPath = path.resolve('./public/uploads/'+imagename+'.jpg');
        if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {
            let imageRepos = new ImageRepository.imageRepository();
            fs.rename(tempPath, targetPath, function(err : any) {
                if (err) throw err;
                //console.log("Upload completed!");

                let imageinfo = new Images.ImageInfo(imagename, savePath, alttext);
                const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                    promise.then((imageresult:any) => {
                        let galleryimage= new Images.GalleryImage(galleryid, imageresult.imageid, galleryorder, sizecontrollingdimension, sizecontrollingpercentage);
                        if (imagecaption != undefined && imagecaption != null)
                        { galleryimage.galleryimagecaption=imagecaption; }
                        const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.addgalleryimage(galleryimage)); });
                        promise2.then((galleryimageid:any) => {
                            // const promiseDeleteTemp = new Promise.Promise((resolve:any, reject:any) => { resolve(deleteFile("./uploads/"+tempBasename)); });
                            // promiseDeleteTemp.then((filedeleted:any) => {
                                displayMainPortfolio(req,res);
                            // });
                            // promise2.catch((err : any) => {
                            //     displayMainPortfolio(req,res);
                            // });
                        });
                        promise2.catch((err : any) => {
                            throw err;
                        });
                    promise.catch((err : any) => {
                        throw err;
                        });
                });
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

router.get('/editportfolioimage', (req, res) => {

    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let imageid = req.query.imageid;
    let imagefilepath = req.query.imagefilepath;
    let galleryimageid = req.query.galleryimageid;   

    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getgalleryimagebygalleryimageid(galleryimageid)); });
    promise.then((galleryimage:any) => {
        res.render('portfolio/editportfolioimage', { title: 'AlmosLataan Portfolio Image Edit', loggedin : loggedin, isadmin : isadmin, galleryimage : galleryimage});
    });
    promise.catch((err : any) => {
        throw err;
    });


});

router.post('/editportfolioimage', (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let galleryimageid = req.body.galleryimageid; 
    let galleryimagecaption = req.body.galleryimagecaption;
    let galleryimageordernumber = req.body.galleryimageordernumber;
    let sizecontrollingdimension = req.body.sizecontrollingdimension;
    let sizecontrollingpercentage = req.body.sizecontrollingpercentage;

    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getgalleryimagebygalleryimageid(galleryimageid)); });
    promise.then((galleryimage:any) => {
        galleryimage.galleryimagecaption = galleryimagecaption;
        galleryimage.galleryimageordernumber = galleryimageordernumber;
        galleryimage.sizecontrollingdimension = sizecontrollingdimension;
        galleryimage.sizecontrollingpercentage = sizecontrollingpercentage;

        const promiseUpdate = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.updategalleryimage(galleryimage)); });
        promiseUpdate.then((galleryimage:any) => {
            displayMainPortfolio(req, res);
        });
        promiseUpdate((err : any) => {
            throw err;
        });
    });
    promise.catch((err : any) => {
        throw err;
    });
});

router.post('/deleteportfolioimage', (req:any, res:any, next: any) =>{

    let imageid = req.body.imageid;
    let imagefilepath = req.body.imagefilepath;
    let galleryimageid = req.body.galleryimageid;
    //Delete:
    //ImageInfo
    //GalleryImage
    //Thumbnails
    let imageRepos = new ImageRepository.imageRepository();
    //This should really all be in a transaction
    
    const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(deleteFile("./public"+imagefilepath)); });
    promise2.then((filedeleted:any) => {
        //delete gallery image
        const promise3 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.deletegalleryimage(galleryimageid));; });
        promise3.then((gideleted:any) => {
            //delete imageinfo
            const promise4 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.deleteimageinfo(imageid));; });
            promise4.then((imagedeleted:any) => {
                let postRepos = new PostRepository.postRepository();
                const promiseDeletePostImages = new Promise.Promise((resolve:any, reject:any) => { resolve(postRepos.deletepostimagesbyimageid(imageid));; });
                promiseDeletePostImages.then((postimagesdeleted:any) => {
                    //reload gallery
                    displayMainPortfolio(req, res);
                });
                promiseDeletePostImages.catch((err : any) => {
                    throw err;
                });
            });
            promise4.catch((err : any) => {
                throw err;
            });
        });
        promise3.catch((err : any) => {
            throw err;
        });
    });
    promise2.catch((err : any) => {
        throw err;
    });
                    
});

function deleteFile (filepath : string) { 
    const fs = require('fs');

    fs.unlinkSync(filepath);
}

function displayMainPortfolio (req: any, res: any)
{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let imageRepos = new ImageRepository.imageRepository();
    const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getdefaultgallery()); });
        promise.then((gallery:any) => {
            if (gallery == null)
            {
                //No default gallery set yet, so insert one
                let defaultgallery = new Images.Gallery("Featured");
                defaultgallery.isdefault = true;
                  const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.addgallery(defaultgallery));});
                    promise2.then((galleryid:any) => {
                        defaultgallery.galleryid=galleryid;
                        res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio', loggedin : loggedin, isadmin : isadmin, mainportfolio : defaultgallery});
                    });
                    promise.catch((err : any) => {
                     });
            }
            else
            {
                const promise2 = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getimagesbygalleryid(gallery.galleryid));});
                    promise2.then((galleryimages:any) => {
                        //might be null
                        gallery.galleryimages= galleryimages;
                        let gallerytotal = galleryimages.length;
                        res.render('portfolio/portfolio', { title: 'AlmosLataan Portfolio',loggedin : loggedin, isadmin : isadmin, mainportfolio : gallery, gallerytotal:gallerytotal});
                    });
                    promise.catch((err : any) => {
                     });
            }
        });
        promise.catch((err : any) => {
            //displayBlog(req, res);
        });
}


export= router;