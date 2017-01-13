/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const Images = require("../models/Images/ImagesModule");
//import * as GalleryImages from '../models/Images/GalleryImage';
const dbProvider = require("../../db");
class imageRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    //ADDS
    addimageinfo(image) {
        return this.db.one('INSERT INTO imageinfos(imagename, imagefilepath, imagetitle, imagealt, height, width, orientation, datecreated, imagebuylink) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING imageid', [image.imagename, image.imagefilepath, image.imagetitle, image.imagealt, image.height, image.width, image.orientation, image.datecreated, image.imagebuylink]);
    }
    ;
    //UPDATES
    updateimageinfo(image) {
        return this.db.result('UPDATE imageinfos SET imagealt = $1, imagetitle = $2, imagebuylink = $3 WHERE imageid = $4', [image.imagealt, image.imagetitle, image.imagebuylink, image.imageid]);
    }
    //GETS
    getimageinfobyimageid(imageid) {
        //return this.db.oneOrNone('SELECT * FROM imageinfos where imageid = $1', [imageid]);
        return new Promise((resolve, reject) => { resolve(this.db.oneOrNone('SELECT * FROM imageinfos where imageid = $1', [imageid])); }).then((image) => {
            if (image != null) {
                let mappedimage;
                let imageid = image.imageid;
                let imagename = image.imagename;
                let imagefilepath = image.imagefilepath;
                let imagetitle = image.imagetitle;
                let imagealt = image.imagealt;
                let imagedatecreated = image.datecreated;
                let height = image.height;
                let width = image.width;
                let orientation = image.orientation;
                let imagebuylink = image.imagebuylink;
                mappedimage = new Images.ImageInfo(imagename, imagefilepath, imagealt, imagetitle, height, width, imageid, imagebuylink);
                return mappedimage;
            }
            else {
                return null;
            }
        });
    }
    ;
    getallimages() {
        return this.db.manyOrNone('select * from imageinfos');
    }
    ;
    getimagesbypostid(postid) {
        return this.db.manyOrNone('select pi.postimageid, pi.postimagecaption, i.* from imageinfos i inner join postimages pi on i.imageid=pi.imageid where pi.postid = $1', [postid]);
    }
    ;
    //DELETES
    deleteimageinfo(imageid) {
        return this.db.query('DELETE FROM imageinfos WHERE imageid =$1', [imageid]);
    }
    ;
}
exports.imageRepository = imageRepository;
//# sourceMappingURL=imageRepository.js.map