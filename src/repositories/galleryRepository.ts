/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Images from '../models/Images/ImagesModule';
//import * as GalleryImages from '../models/Images/GalleryImage';
import dbProvider = require('../../db')

export class galleryRepository
{

    db = dbProvider.dbpool;
    
    constructor() {
            }

    //ADDS
    addgallery(gallery : Images.Gallery)
    {
            return this.db.one('INSERT INTO galleries(galleryname, isdefault, isprivate, datecreated) VALUES($1, $2, $3, $4) RETURNING galleryid', [gallery.galleryname, gallery.isdefault, gallery.isprivate, gallery.datecreated]);
    };

    addgalleryimage(galleryimage : Images.GalleryImage)
    {
            return this.db.one('INSERT INTO galleryimages(galleryid, imageid, galleryimageordernumber, galleryimagecaption, sizecontrollingdimension, sizecontrollingpercentage, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING galleryimageid', [galleryimage.galleryid, galleryimage.imageid, galleryimage.galleryimageordernumber, galleryimage.galleryimagecaption, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.datecreated]);
    };

    //UPDATES
    updategalleryimage(galleryimage: Images.GalleryImage)
    {
            return this.db.result('UPDATE galleryimages SET galleryimagecaption = $1, galleryimageordernumber = $2, sizecontrollingdimension = $3, sizecontrollingpercentage=$4 WHERE galleryimageid=$5',[galleryimage.galleryimagecaption, galleryimage.galleryimageordernumber, galleryimage.sizecontrollingdimension, galleryimage.sizecontrollingpercentage, galleryimage.galleryimageid]);
    }

    updategalleryimagesortorderbyid(galleryimageid:number, sortnumber:number)
    {
            return this.db.result('UPDATE galleryimages SET galleryimageordernumber = $1 WHERE galleryimageid=$2',[sortnumber, galleryimageid]);
    }

    updatedefaultgallerytofalse(){

                return this.db.result('UPDATE galleries SET isdefault = $1',[false]);
        }

    //GETS
    getgallerybyid(id : number)
    {
        return this.db.oneOrNone('SELECT * FROM galleries where galleryid=$1', [id]);
    };
    getallgalleries()
    {
            return this.db.manyOrNone('SELECT * FROM galleries');
    };
    getdefaultgallery()
    {
            return this.db.oneOrNone('SELECT * FROM galleries where isdefault = true');
    };
    getimagesbygalleryid(galleryid : number)
    {
            return this.db.manyOrNone('select i.*, gi.galleryimageid, gi.sizecontrollingdimension, gi.sizecontrollingpercentage from imageinfos i inner join galleryimages gi on i.imageid = gi.imageid inner join galleries g on gi.galleryid = g.galleryid where g.galleryid = $1 order by gi.galleryimageordernumber asc', galleryid);
    };
    getgalleryimagebygalleryimageid(galleryimageid:number)
    {
            return this.db.one('select gi.*, i.imagealt, i.imagetitle from galleryimages gi inner join imageinfos i on gi.imageid = i.imageid where galleryimageid=$1', [galleryimageid]);
    };

    //DELETES
    deletegalleryimage(galleryimageid : number)
    {
            return this.db.result('DELETE FROM galleryimages WHERE galleryimageid = $1', [galleryimageid]); 
    }

}