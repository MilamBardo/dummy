/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Posts from '../models/Posts/Post';
import dbProvider = require('../../db')

export class postRepository
{

    db = dbProvider.dbpool;
    
    constructor() {
            }

         add (post: Posts.Posts.Post)
        {
                return this.db.one('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [post.postTitle, post.postBody, post.postDate]);
        };

        findmostrecentposts(postnumber: number)
        {
            return this.db.manyOrNone('select * from posts order by postdate desc limit $1', postnumber);
        };
}