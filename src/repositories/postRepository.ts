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
                return this.db.one('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [post.posttitle, post.postbody, post.postdate]);
        };
        addpostimage(postimage : Posts.PostImage)
        {
                return this.db.one('INSERT INTO postimages(postid, imageid, postimagecaption, sizecontrollingdimension, sizecontrollingpercentage, imagetype, imagetypeorder, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING postimageid', [postimage.postid, postimage.imageid, postimage.postimagecaption, postimage.sizecontrollingdimension, postimage.sizecontrollingpercentage, postimage.imagetype, postimage.imagetypeorder, postimage.datecreated]);
        };

        //UPDATES
        updatepostimage(postimage : Posts.PostImage)
        {
                //hacky - should really be using postimageid, but need to figureout how to map objects properly
                return this.db.result('UPDATE postimages SET imageid = $1, postimagecaption = $2 WHERE postid=$3', [postimage.imageid, postimage.postimagecaption,postimage.postid])
        }
        updatepost(post: Posts.Post)
        {
               return this.db.result('update posts set posttitle = $1, postbody=$2 where id=$3', [post.posttitle, post.postbody, post.id]);
        };

        //GETS
        getpostbyid(postid: number)
        {
                return this.db.oneOrNone('SELECT * FROM posts WHERE id =$1', [postid]);
        };
        getpostimagesbypostid(postid : number)
        {
                return this.db.manyOrNone('SELECT pi.*, i.imagefilepath, i.imagealt, i.imagetitle FROM postimages pi inner join imageinfos i on pi.imageid = i.imageid WHERE postid =$1',[postid]);
        };
        getpostimagebypostimageid(postimageid : number)
        {
                return this.db.one('SELECT * FROM postimages WHERE postimageid =$1',[postimageid]);
        };
        getmostrecentposts(postnumber: number)
        {
            return this.db.manyOrNone('select p.*, i.imagefilepath, i.imagealt, pi.postimagecaption from posts p left join postimages pi on p.id=pi.postid left join imageinfos i on pi.imageid = i.imageid order by p.postdate desc limit $1', postnumber);
        };
        getallposts()
        {
                return this.db.manyOrNone('select * from posts');
        }
        
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