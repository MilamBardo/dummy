/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
"use strict";
const dbProvider = require('../../db');
class postRepository {
    constructor() {
        this.db = dbProvider.dbpool;
    }
    add(post) {
        return this.db.one('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [post.postTitle, post.postBody, post.postDate]);
    }
    ;
    findmostrecentposts(postnumber) {
        return this.db.manyOrNone('select * from posts order by postdate desc limit $1', postnumber);
    }
    ;
}
exports.postRepository = postRepository;
//# sourceMappingURL=postRepository.js.map