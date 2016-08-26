/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Posts from '../models/Posts/Post';
import dbProvider = require('../../db')

export class postRepository
{
    // pgp = pgPromise({
    //     });
    // connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';

    db = dbProvider.dbpool;
    
    constructor() {
            }

    // add (post: Posts.Posts.Post) 
    //     { 
    //         let posttitle = post.postTitle;
    //         let postbody = post.postBody;
    //         let postdate = post.postDate;

    //         let callback = ((err: Error, client: pg.Client)=>
    //         { 
    //             client.query('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [posttitle, postbody, postdate], function(err, result) {
    //                         // you MUST return your client back to the pool when you're done!
    //                         //console.log(result.rows[0].name); // output: foo
    //                             if (err)
    //                             {
    //                                 throw err;
    //                             }
    //                             else
    //                             {
    //                                 return result;
    //                             }
    //                         });
    //         });
    //         pg.connect(this.connectionString, callback);
            
    //     };

         add (post: Posts.Posts.Post)
        {
                return this.db.one('INSERT INTO posts(posttitle, postbody, postdate) VALUES($1, $2, $3) RETURNING id', [post.postTitle, post.postBody, post.postDate]);
        };

        findmostrecentposts(postnumber: number)
        {
            return this.db.manyOrNone('select * from posts order by postdate desc limit $1', postnumber);
        };
}