/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const dbProvider = require('../../db');
class postRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    add(post) {
        return this.db.one('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [post.posttitle, post.postbody, post.postdate]);
    }
    ;
    getpostbyid(postid) {
        return this.db.oneOrNone('SELECT * FROM posts WHERE id =$1', [postid]);
    }
    ;
    findmostrecentposts(postnumber) {
        return this.db.manyOrNone('select * from posts order by postdate desc limit $1', postnumber);
    }
    ;
    updatepost(post) {
        return this.db.result('update posts set posttitle = $1, postbody=$2 where id=$3', [post.posttitle, post.postbody, post.id]);
    }
    ;
}
exports.postRepository = postRepository;
//# sourceMappingURL=postRepository.js.map