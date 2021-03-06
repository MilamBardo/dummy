/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const Posts = require('../models/Posts/PostsModule');
const dbProvider = require('../../db');
class postRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    add(post) {
        return this.db.one('INSERT INTO posts(posttitle, postURL, postbody, postdate) VALUES($1, $2, $3, $4) RETURNING id', [post.posttitle, post.posturl, post.postbody, post.postdate]);
    }
    ;
    addpostimage(postimage) {
        return this.db.one('INSERT INTO postimages(postid, imageid, postimagecaption, sizecontrollingdimension, sizecontrollingpercentage, imagetype, imagetypeorder, datecreated) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING postimageid', [postimage.postid, postimage.imageid, postimage.postimagecaption, postimage.sizecontrollingdimension, postimage.sizecontrollingpercentage, postimage.imagetype, postimage.imagetypeorder, postimage.datecreated]);
    }
    ;
    //UPDATES
    updatepostimage(postimage) {
        //hacky - should really be using postimageid, but need to figureout how to map objects properly
        return this.db.result('UPDATE postimages SET imageid = $1, postimagecaption = $2 WHERE postid=$3', [postimage.imageid, postimage.postimagecaption, postimage.postid]);
    }
    updatepost(post) {
        return this.db.result('update posts set posttitle = $1, postURL=$2, postbody=$3 where id=$4', [post.posttitle, post.posturl, post.postbody, post.id]);
    }
    ;
    //GETS
    getpostbyid(postid) {
        return new Promise((resolve, reject) => { resolve(this.db.oneOrNone('SELECT * FROM posts WHERE id =$1', [postid])); }).then((post) => {
            let mappedpost;
            let ptitle = post.posttitle;
            let pbody = post.postbody;
            let id = post.id;
            let url = post.posturl;
            let pdate = post.postdate;
            mappedpost = new Posts.Post(ptitle, pbody, id, url, pdate);
            return mappedpost;
        });
    }
    ;
    getpostimagesbypostid(postid) {
        return this.db.manyOrNone('SELECT pi.*, i.imagefilepath, i.imagealt, i.imagetitle FROM postimages pi inner join imageinfos i on pi.imageid = i.imageid WHERE postid =$1', [postid]);
    }
    ;
    getpostimagebypostimageid(postimageid) {
        return this.db.one('SELECT * FROM postimages WHERE postimageid =$1', [postimageid]);
    }
    ;
    getmostrecentposts(postnumber) {
        return this.db.manyOrNone('select p.*, i.imagefilepath, i.imagealt, i.orientation, pi.postimagecaption from posts p left join postimages pi on p.id=pi.postid left join imageinfos i on pi.imageid = i.imageid order by p.postdate desc limit $1', postnumber);
    }
    ;
    getallposts() {
        return this.db.manyOrNone('select * from posts');
    }
    //DELETES
    deletepostimage(postimageid) {
        return this.db.result('DELETE FROM postimages WHERE postimageid = $1', [postimageid]);
    }
    deletepostimagesbyimageid(imageid) {
        return this.db.result('DELETE FROM postimages WHERE imageid = $1', [imageid]);
    }
}
exports.postRepository = postRepository;
//# sourceMappingURL=postRepository.js.map