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
    addimageinfo(image) {
        return this.db.one('INSERT INTO imageinfos(imagename, imagefilepath, imagetitle, imagealt, height, width, orientation, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING imageid', [image.imagename, image.imagefilepath, image.imagetitle, image.imagealt, image.height, image.width, image.orientation, image.datecreated]);
    }
    ;
    //UPDATES
    updateimageinfo(image) {
        return this.db.result('UPDATE imageinfos SET imagealt = $1, imagetitle = $2 WHERE imageid = $3', [image.imagealt, image.imagetitle, image.imageid]);
    }
    //GETS
    getimageinfobyimageid(imageid) {
        return this.db.oneOrNone('SELECT * FROM imageinfos where imageid = $1', [imageid]);
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