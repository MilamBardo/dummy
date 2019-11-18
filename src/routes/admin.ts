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
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        try{
            displayadminpanel(req,res, null)
        }
        catch (err)
        {
            throw new Error("caught an error")
        }
    }
    else{
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
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
        let imageRepos = new ImageRepository.imageRepository();
        const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.getallgalleries()); });
            promise.then((galleryresult:any) => {

                const promiseImages = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getallimages()); });
                promiseImages.then((imagelist:any) => {

                    res.render('admin/adminpanel', { title: 'AlmosLataan Admin', galleries: galleryresult, imagelist: imagelist, errmsg:err });
                });
            
            });
            promise.catch((err : any) => {
                throw err;
            });
    }
    else{
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
    }
}

router.post('/uploadimage', upload.single('file'), (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    try
    {
    if (loggedin && isadmin)
    {
        let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        let imagecaption = req.body.imagecaption;
        let imagebuylink = req.body.imagebuylink;

        var path = require('path'),
        fs = require('fs');

        let tempPath = req.file.path;
        let tempBasename = path.basename(tempPath);
        let savePath = /uploads/ + imagename + '.jpg'
        //LOCAL
        let targetPath = path.resolve('./public/uploads/'+imagename+'.jpg');
        //LIVE
        //let targetPath = path.resolve('./apps/Almos/public/uploads/'+imagename+'.jpg');
        if (path.extname(req.file.originalname).toLowerCase() === '.jpg') {

            var sizeOf = require('image-size');
                //sizeOf(tempPath, function (err : any, dimensions : any) {
                        //if (err) throw err;
                        
                         var dimensions = sizeOf(tempPath);
                         var imgwidth= dimensions.width;
                         var imgheight= dimensions.height;
                         
                         if( imgwidth>200 && imgheight>200)
                         {
                             let imageRepos = new ImageRepository.imageRepository();
                             //displayadminpanel(req,res, "pastimageRepos. temppath="+tempPath+" targetpath="+targetPath);
                             fs.rename(tempPath, targetPath, function(err : any) {
                                // if (err) throw err;
                                  //displayadminpanel(req,res, "past fs rename. temppath="+tempPath+" targetpath="+targetPath);
                                 let imageinfo = new Images.ImageInfo(imagename, savePath, alttext, imagetitle, imgheight, imgwidth, imagebuylink);
                                 const promise = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.addimageinfo(imageinfo)); });
                                     promise.then((imageresult:any) => {
                                                 displayadminpanel(req,res, null);
                                     promise.catch((err : any) => {
                        //                 //throw err;
                                         displayadminpanel(req,res, "error on sql addimageinfo");
                                         });
                                     });
                             });
                         }
                         else
                         {
                             displayadminpanel(req,res, "image width and height not greater than");
                         }

                //});
        } 
        else {
            fs.unlink(tempPath, function (err:any) {
                if (err) throw err;
                console.error("Only .jpg files are allowed!");
            });
            displayadminpanel(req,res, "path not equal to jpg");
        }
    }
    else{
        displayadminpanel(req,res, "either notlogged in or not admin");
    }
}
catch(error)
{
    displayadminpanel(req,res, "error caught");
}
});

router.get('/editimage', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let imageid = req.query.imagelist;
        let imageRepos = new ImageRepository.imageRepository();

        const promiseGet = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getimageinfobyimageid(imageid));});
        
        promiseGet.then((imageinfo:Images.ImageInfo) => {
            res.render('admin/editimage', {loggedin : loggedin, isadmin : isadmin, image: imageinfo})
        });
        promiseGet.catch((err : any) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
                throw err;
        });
    }
    else{
        res.render('index', { title: 'AlmosLataan Home', loggedin: false });
    }

});

router.post('/editimage', upload.single('file'), (req:any, res:any, next: any) =>{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        let imageid = req.body.imageid;
        //let imagename = req.body.imagename;
        let alttext = req.body.alttext;
        let imagetitle = req.body.imagetitle;
        //let imagecaption = req.body.imagecaption;
        let imagebuylink = req.body.imagebuylink;

        let imageRepos = new ImageRepository.imageRepository();

        const promiseGet = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.getimageinfobyimageid(imageid));});

        promiseGet.then((masterimage:Images.ImageInfo) => {
            masterimage.imagealt = alttext;
            masterimage.imagetitle = imagetitle;
            masterimage.imagebuylink = imagebuylink;

             const promiseUpdate = new Promise.Promise((resolve:any, reject:any) => { resolve(imageRepos.updateimageinfo(masterimage));});
             promiseUpdate.then((result:any) => {
                displayadminpanel(req,res, masterimage.imagename+"updated")
             });
             promiseUpdate.catch((err : any) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
                throw err;
            });
        });
        promiseGet.catch((err : any) => {
                //PLEASE WRITE A FUCKING ERROR LOG TABLE
                throw err;
        });
    }

});

router.get('/addnewgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    if (loggedin && isadmin)
    {
        res.render('admin/addnewgallery', {loggedin : loggedin, isadmin : isadmin})
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

router.post('/editgallery', (req:any, res:any, next: any) =>{
     let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let galleryid = req.body.galleryid;
    let galleryname = req.body.galleryname;
    let galleryisprivate = req.body.galleryisprivate == "on" ? true : false;;
    let isdefault = req.body.isdefault == "on" ? true : false;;
    let galleryRepos = new GalleryRepository.galleryRepository();
    let imageRepos = new ImageRepository.imageRepository();
    if (loggedin && isadmin && galleryid != undefined )
    {
        //fetch gallery

        const promiseGetGallery = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.getgallerybyid(galleryid))})
        promiseGetGallery.then((gallery:Images.Gallery) => {
            if (gallery)
            {
                gallery.galleryname = galleryname;
                gallery.isdefault = isdefault;
                gallery.isprivate = galleryisprivate;

                 const promiseUpdate = new Promise.Promise((resolve:any, reject:any) => { resolve(galleryRepos.updategallery(gallery)); });
                promiseUpdate.then((postupdated:any) => {
                    fetchGallery(req,res,galleryid);
                });
                promiseUpdate.catch((err:any) =>{
                    throw err;
                });
            }
            else
            {
                //probably been logged out
                displayadminpanel(req,res, "cannot edit gallery")
            }
        });
        promiseGetGallery.catch((err:any) =>{
            throw err;
        });
    }
    
});

router.get('/editgallery', (req, res) => {
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;

    let galleryid = req.query.gallerylist;
    
    if (loggedin && isadmin && galleryid != undefined )
    {
        //fetch gallery

        fetchGallery(req,res,galleryid);
    }
    else
    {
        //probably been logged out
        displayadminpanel(req,res, "cannot edit gallery")
    }
});

router.post('/deleteImageFromGallery', (req:any,res:any) => {
    try{
        if (req.body)
        {
            let galleryRepos = new GalleryRepository.galleryRepository();
            let galleryimageid = req.body[0].galleryimageid;
            const promisedeletegalleryimage = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.deletegalleryimage(galleryimageid))});
            promisedeletegalleryimage.then((result:any) => {
                res.setHeader("Content-Type", "text/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify("imagedeleted"));
            });
            promisedeletegalleryimage.catch((error:any) => {
                throw error;
            });
        }
        else
        {
            throw new Error("no request body provided");
        }
    }
    catch(e)
    {
        //should really log first;
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        let errorstring : string = (<Error>e).message;
        res.end(JSON.stringify("error when deleting image from gallery"+errorstring));
    }
});
//save gallery ajax request
router.post('/saveGallery', (req : any, res: any) => {
    try{
            if (req.body)
            {
                let galleryRepos = new GalleryRepository.galleryRepository();
                var imagearray = req.body;
                //ideally, these should all be in a transaction, but whatever;
                for (var item of imagearray ) {
                    //first, check whether image has a agllery image yet
                    if (item.galleryimageid == "")
                    {
                        //insert galleryimages
                        let gimage : Images.GalleryImage = new Images.GalleryImage(item.galleryid, item.imageid, item.galleryimagesortnumber, "width", "50%" );
                        gimage.galleryimagecaption = "no info";
                        let promiseInsertGalleryImage = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.addgalleryimage(gimage))});
                        promiseInsertGalleryImage.catch((err:any) =>{
                            throw err;
                        });
                    }
                    else
                    {
                        //change order of gallery image
                        //should really fetch from server 1st, but going to skip that and just add a method
                        let promise = new Promise.Promise( (resolve: any, reject:any) => {resolve(galleryRepos.updategalleryimagesortorderbyid(item.galleryimageid, item.galleryimagesortnumber))});
                        promise.then((galleryimages:any) => {
                            //Woopy doo da
                            
                        });
                        promise.catch((err:any) =>{
                            throw err;
                        });
                    }
                }
                //success
                res.setHeader("Content-Type", "text/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify(true));
            }
            else
            {
                res.setHeader("Content-Type", "text/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify("no data supplied"));
            }
    }
    catch(e){
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify("exception caught"));
    }
   //res.send(JSON.stringify({ result: true }));
   //Rest of the code
});

router.post('fetchimage', (req:any, res:any) => {
    if (req.body)
    {
        let imageRepos = new ImageRepository.imageRepository();

        var imagearray = req.body;
        var imagerequired = imagearray[0];
        var imageid = imagerequired.imageid;
    }
});

function fetchGallery(req:any, res:any, galleryid : number)
{
    let loggedin = req.session.username == null ? false : true;
    let isadmin = req.session.userisadmin == null ? false : true;
    let galleryRepos = new GalleryRepository.galleryRepository();
    let imageRepos = new ImageRepository.imageRepository();
    const promiseGetGallery = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.getgallerybyid(galleryid))})
        promiseGetGallery.then((gallery:any) => {
            if (gallery == undefined || gallery == null)
            {
                displayadminpanel(res, req, "Cannot edit gallery as gallery not found");
            }

            const promiseGetGalleryImages = new Promise.Promise((resolve:any, reject:any) => {resolve(galleryRepos.getimagesbygalleryid(galleryid))});
            promiseGetGalleryImages.then((galleryimages:any) => {

                //Check for further other Images
                const promiseGetOtherImages = new Promise.Promise((resolve:any, reject:any) => {resolve(imageRepos.getallimages())});
                promiseGetOtherImages.then((otherimages:any) => {

                    
                    let remaining : any[] = [];
                    for (var oimage of otherimages)
                    {
                        var found = false;
                        for (var gimage of galleryimages)
                        {
                            if (oimage.imageid == gimage.imageid)
                            {
                                found = true;
                            }
                           
                        }
                        if (!found)
                        {
                            remaining.push(oimage);
                        }
                    }
                    
                    //Have all information so display
                    res.render('admin/editgallery', {loggedin : loggedin, isadmin : isadmin, gallery: gallery, galleryimages: galleryimages, otherimages: remaining})
                });
            });
            promiseGetGalleryImages.catch((err:any) =>{
            throw err;
        });
        })
        //fetch gallery pictures

        

        promiseGetGallery.catch((err:any) =>{
            throw err;
        });
}

export= router;