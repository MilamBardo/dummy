/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const Images = require("../models/Images/ImagesModule");
//import * as GalleryImages from '../models/Images/GalleryImage';
const dbProvider = require("../../db");
class galleryRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    //ADDS
    addgallery(gallery) {
        return this.db.one('INSERT INTO galleries(galleryname, isdefault, isprivate, datecreated) VALUES($1, $2, $3, $4) RETURNING galleryid', [gallery.galleryname, gallery.isdefault, gallery.isprivate, gallery.datecreated]);
    }
    ;
    addgalleryimage(galleryimage) {
        return this.db.one('INSERT INTO galleryimages(galleryid, imageid, galleryimageordernumber, galleryimagecaption, sizecontrollingdimension, sizecontrollingpercentage, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING galleryimageid', [galleryimage.galleryid, galleryimage.imageid, galleryimage.galleryimageordernumber, galleryimage.galleryimagecaption, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.datecreated]);
    }
    ;
    //UPDATES
    updategallery(gallery) {
        return this.db.result('UPDATE galleries SET galleryname = $1, isdefault = $2, isprivate = $3 WHERE galleryid = $4', [gallery.galleryname, gallery.isdefault, gallery.isprivate, gallery.galleryid]);
    }
    updategalleryimage(galleryimage) {
        return this.db.result('UPDATE galleryimages SET galleryimagecaption = $1, galleryimageordernumber = $2, sizecontrollingdimension = $3, sizecontrollingpercentage=$4 WHERE galleryimageid=$5', [galleryimage.galleryimagecaption, galleryimage.galleryimageordernumber, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.galleryimageid]);
    }
    updategalleryimagesortorderbyid(galleryimageid, sortnumber) {
        return this.db.result('UPDATE galleryimages SET galleryimageordernumber = $1 WHERE galleryimageid=$2', [sortnumber, galleryimageid]);
    }
    updatedefaultgallerytofalse() {
        return this.db.result('UPDATE galleries SET isdefault = $1', [false]);
    }
    //GETS
    getgallerybyid(id) {
        //return this.db.oneOrNone('SELECT * FROM galleries where galleryid=$1', [id]);
        return new Promise((resolve, reject) => { resolve(this.db.oneOrNone('SELECT * FROM galleries where galleryid=$1', [id])); }).then((gallery) => {
            let mappedgallery;
            let gid = gallery.galleryid;
            let gname = gallery.galleryname;
            let gisdefault = gallery.isdefault;
            let gisprivate = gallery.isprivate;
            let gdatecreated = gallery.datecreated;
            mappedgallery = new Images.Gallery(gname, gid, gisdefault, gisprivate, gdatecreated);
            return mappedgallery;
        });
    }
    ;
    getallgalleries() {
        return this.db.manyOrNone('SELECT * FROM galleries');
    }
    ;
    getallnonprivategalleries() {
        return this.db.manyOrNone('SELECT * FROM galleries WHERE isprivate = false');
    }
    ;
    getdefaultgallery() {
        return this.db.oneOrNone('SELECT * FROM galleries where isdefault = true');
    }
    ;
    getimagesbygalleryid(galleryid) {
        return this.db.manyOrNone('select i.*, gi.galleryimageid, gi.sizecontrollingdimension, gi.sizecontrollingpercentage from imageinfos i inner join galleryimages gi on i.imageid = gi.imageid inner join galleries g on gi.galleryid = g.galleryid where g.galleryid = $1 order by gi.galleryimageordernumber asc', galleryid);
    }
    ;
    getgalleryimagebygalleryimageid(galleryimageid) {
        return this.db.one('select gi.*, i.imagealt, i.imagetitle from galleryimages gi inner join imageinfos i on gi.imageid = i.imageid where galleryimageid=$1', [galleryimageid]);
    }
    ;
    //DELETES
    deletegalleryimage(galleryimageid) {
        return this.db.result('DELETE FROM galleryimages WHERE galleryimageid = $1', [galleryimageid]);
    }
}
exports.galleryRepository = galleryRepository;
//# sourceMappingURL=galleryRepository.js.map