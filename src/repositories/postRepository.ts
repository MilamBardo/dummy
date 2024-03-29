/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Posts from '../models/Posts/PostsModule';
import dbProvider = require('../../db')

export class postRepository
{

    db = dbProvider.dbpool;
    
    constructor() {
            }

        add (post: Posts.Post)
        {
                return this.db.one('INSERT INTO posts(posttitle, postURL, postexcerpt, postbody, postdate) VALUES($1, $2, $3, $4, $5) RETURNING id', [post.posttitle, post.posturl, post.postexcerpt, post.postbody, post.postdate]);
        };
        addpostimage(postimage : Posts.PostImage)
        {
                return this.db.one('INSERT INTO postimages(postid, imageid, postimagecaption, sizecontrollingdimension, sizecontrollingpercentage, imagetype, imagetypeorder, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING postimageid', [postimage.postid, postimage.imageid, postimage.postimagecaption, postimage.sizecontrollingdimension, postimage.sizecontrollingpercentage, postimage.imagetype, postimage.imagetypeorder, postimage.datecreated]);
        };
        addpostadvertisement(postadvertisement: Posts.PostAdvertisement)
        {
                return this.db.one('INSERT INTO postadvertisements(postid, advertisementid,  position, datecreated) VALUES($1, $2, $3, $4) RETURNING postadvertisementid', [postadvertisement.postid, postadvertisement.advertisementid, postadvertisement.position, postadvertisement.datecreated]);
        }

        //UPDATES
        updatepostimage(postimage : Posts.PostImage)
        {
                //hacky - should really be using postimageid, but need to figureout how to map objects properly
                return this.db.result('UPDATE postimages SET imageid = $1, postimagecaption = $2 WHERE postid=$3', [postimage.imageid, postimage.postimagecaption,postimage.postid])
        }
        updatepost(post: Posts.Post)
        {
               return this.db.result('update posts set posttitle = $1, postURL=$2, postexcerpt=$3, postbody=$4 where id=$5', [post.posttitle, post.posturl, post.postexcerpt, post.postbody, post.id]);
        };

        //GETS
        getpostbyid(postid: number)
        {
                return new Promise( (resolve:any, reject:any) => {resolve(this.db.oneOrNone('SELECT * FROM posts WHERE id =$1', [postid]))}).then((post:any) => {
                        let mappedpost : Posts.Post;
                        let ptitle : string = post.posttitle;
                        let pexcerpt: string = post.postexcerpt;
                        let pbody: string = post.postbody;
                        let id:number = post.id;
                        let url:string = post.posturl;
                        let pdate: Date = post.postdate
                        mappedpost = new Posts.Post(ptitle, pbody, pexcerpt, id, url, pdate);
                        return mappedpost;
                });
        };
        getpostimagesbypostid(postid : number)
        {
                return this.db.manyOrNone('SELECT pi.*, i.imagefilepath, i.imagebuylink, i.imagealt, i.imagetitle FROM postimages pi inner join imageinfos i on pi.imageid = i.imageid WHERE postid =$1',[postid]);
        };
        getpostimagebypostimageid(postimageid : number)
        {
                return this.db.one('SELECT * FROM postimages WHERE postimageid =$1',[postimageid]);
        };
        getposts(postnumber: number, startdate : Date, greaterthanstartdate : boolean )
        {
                if (greaterthanstartdate)
                {
                        return this.db.manyOrNone('select p.* , p.postdate::timestamptz as posttimestamp, i.imagefilepath, i.imagealt, i.orientation, pi.postimagecaption from posts p left join postimages pi on p.id=pi.postid left join imageinfos i on pi.imageid = i.imageid WHERE p.postdate < $1::timestamptz  order by p.postdate desc limit $2', [startdate, postnumber]);
                }
                else{
                        return this.db.manyOrNone('select * from (select p.* , p.postdate::timestamptz as posttimestamp, i.imagefilepath, i.imagealt, i.orientation, pi.postimagecaption from posts p left join postimages pi on p.id=pi.postid left join imageinfos i on pi.imageid = i.imageid WHERE p.postdate > $1::timestamptz  order by p.postdate asc limit $2)cunt order by postdate desc ', [startdate, postnumber]);
                        //need to change select so that 
                }
        };
        getallposts()
        {
                return this.db.manyOrNone('select * from posts');
        };
        getpostadvertisementsforselect(postid:number)
        {
                return this.db.manyOrNone('SELECT pa.postadvertisementid, a.name, a.html, pa.position FROM postadvertisements pa INNER JOIN advertisements a ON pa.advertisementid = a.advertisementid  WHERE pa.isdeleted=false and a.isdeleted = false and pa.postid = $1', [postid]);
        };
        
        //DELETES
        deletepostimage(postimageid : number)
        {
                return this.db.result('DELETE FROM postimages WHERE postimageid = $1', [postimageid])
        }

        deletepostimagesbyimageid(imageid : number)
        {
               return this.db.result('DELETE FROM postimages WHERE imageid = $1', [imageid]) 
        }
        
}