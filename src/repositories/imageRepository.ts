/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Images from '../models/Images/ImagesModule';
//import * as GalleryImages from '../models/Images/GalleryImage';
import dbProvider = require('../../db')

export class imageRepository
{

    db = dbProvider.dbpool;
    
    constructor() {
            }

        //ADDS
        
        addimageinfo (image: Images.ImageInfo)
        {
                return this.db.one('INSERT INTO imageinfos(imagename, imagefilepath, imagetitle, imagealt, height, width, orientation, datecreated, imagebuylink) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING imageid', [image.imagename, image.imagefilepath, image.imagetitle, image.imagealt, image.height, image.width, image.orientation, image.datecreated, image.imagebuylink]);
        };
        

        //UPDATES
        
        updateimageinfo(image : Images.ImageInfo)
        {
                return this.db.result('UPDATE imageinfos SET imagealt = $1, imagetitle = $2, imagebuylink = $3 WHERE imageid = $4', [image.imagealt, image.imagetitle, image.imagebuylink, image.imageid]);
        }

        

        //GETS
        getimageinfobyimageid(imageid : number)
        {
                //return this.db.oneOrNone('SELECT * FROM imageinfos where imageid = $1', [imageid]);

                return new Promise( (resolve:any, reject:any) => {resolve(this.db.oneOrNone('SELECT * FROM imageinfos where imageid = $1', [imageid]))}).then((image:any) => {
                        if (image != null)
                        {
                                let mappedimage : Images.ImageInfo;
                                let imageid:number = image.imageid;
                                let imagename : string = image.imagename;
                                let imagefilepath: string = image.imagefilepath;
                                let imagetitle: string = image.imagetitle;
                                let imagealt: string = image.imagealt;
                                let imagedatecreated: Date = image.datecreated;
                                let height: number = image.height;
                                let width: number = image.width;
                                let orientation: string = image.orientation;
                                let imagebuylink: string = image.imagebuylink;
                                mappedimage = new Images.ImageInfo(imagename, imagefilepath, imagealt, imagetitle, height, width, imageid, imagebuylink);
                                return mappedimage;
                        }
                        else
                        {
                                return null;
                        }
                });
        };
        
        getallimages()
        {
                return this.db.manyOrNone('select * from imageinfos');
        };
        getimagesbypostid(postid: number)
        {
                return this.db.manyOrNone('select pi.postimageid, pi.postimagecaption, i.* from imageinfos i inner join postimages pi on i.imageid=pi.imageid where pi.postid = $1', [postid]);
        };
        

        //DELETES
        deleteimageinfo(imageid : number)
        {
                return this.db.query('DELETE FROM imageinfos WHERE imageid =$1', [imageid]);
        };
        
        
}