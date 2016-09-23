/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
//import * as GalleryImages from '../models/Images/GalleryImage';
const dbProvider = require('../../db');
class imageRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    //ADDS
    addgallery(gallery) {
        return this.db.one('INSERT INTO galleries(galleryname, isdefault, isprivate, datecreated) VALUES($1, $2, $3, $4) RETURNING galleryid', [gallery.galleryname, gallery.isdefault, gallery.isprivate, gallery.datecreated]);
    }
    ;
    addimageinfo(image) {
        return this.db.one('INSERT INTO imageinfos(imagename, imagefilepath, imagealt, datecreated) VALUES($1, $2, $3, $4) RETURNING imageid', [image.imagename, image.imagefilepath, image.imagealt, image.datecreated]);
    }
    ;
    addgalleryimage(galleryimage) {
        return this.db.one('INSERT INTO galleryimages(galleryid, imageid, galleryimageordernumber, galleryimagecaption, sizecontrollingdimension, sizecontrollingpercentage, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING galleryimageid', [galleryimage.galleryid, galleryimage.imageid, galleryimage.galleryimageordernumber, galleryimage.galleryimagecaption, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.datecreated]);
    }
    ;
    //UPDATES
    updategalleryimage(galleryimage) {
        return this.db.result('UPDATE galleryimages SET galleryimagecaption = $1, galleryimageordernumber = $2, sizecontrollingdimension = $3, sizecontrollingpercentage=$4 WHERE galleryimageid=$5', [galleryimage.galleryimagecaption, galleryimage.galleryimageordernumber, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.galleryimageid]);
    }
    //GETS
    getimageinfobyimageid(imageid) {
        return this.db.oneOrNone('SELECT * FROM imageinfo where imageid = $1', [imageid]);
    }
    ;
    getallgalleries() {
        return this.db.manyOrNone('SELECT * FROM galleries');
    }
    ;
    getdefaultgallery() {
        return this.db.oneOrNone('SELECT * FROM galleries where isdefault = true');
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
    getimagesbygalleryid(galleryid) {
        return this.db.manyOrNone('select i.*, gi.galleryimageid, gi.sizecontrollingdimension, gi.sizecontrollingpercentage from imageinfos i inner join galleryimages gi on i.imageid = gi.imageid inner join galleries g on gi.galleryid = g.galleryid where g.galleryid = $1 order by gi.galleryimageordernumber asc', galleryid);
    }
    ;
    getgalleryimagebygalleryimageid(galleryimageid) {
        return this.db.one('select * from galleryimages where galleryimageid=$1', [galleryimageid]);
    }
    ;
    //DELETES
    deleteimageinfo(imageid) {
        return this.db.query('DELETE FROM imageinfos WHERE imageid =$1', [imageid]);
    }
    ;
    deletegalleryimage(galleryimageid) {
        return this.db.result('DELETE FROM galleryimages WHERE galleryimageid = $1', [galleryimageid]);
    }
}
exports.imageRepository = imageRepository;
//# sourceMappingURL=imageRepository.js.map