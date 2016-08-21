//import sqlProvider = require('../sql');
//var sql = sqlProvider.products;

/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>

import * as pg from 'pg';
import * as pgPromise from 'pg-promise';
import * as Users from '../models/Users/User';
    export class userRepository
    {
        pgp = pgPromise({
    // Initialization Options
        });
        connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';

        db = this.pgp(this.connectionString);

        config = {
            host: 'localhost',
            user: 'Almos', //env var: PGUSER
            database: 'Almos', //env var: PGDATABASE
            password: 'Talanath5', //env var: PGPASSWORD
            port: 5432 //env var: PGPORT
            };

        // constructor(db:any) {
        //     this.db = db;
        // }
        constructor() {
            }
        

        // Creates the table;
        //create = () =>this.db.none(sql.create);

        // Drops the table;
        //drop = () => this.db.none(sql.drop);

        // Removes all records from the table;
        //empty = () => this.db.none(sql.empty);

        // Adds a new record and returns the new id;
        // It is also an example of mapping HTTP requests directly into query parameters;
        
        // addnew = (values:any) =>
        //  this.db.one(sql.add, values)
        //  .then((user:any) => user.id);

        add (u: Users.Users.User) 
        { 
            let uname = u.name;
            let upassword = u.encryptedpassword;

            let callback = ((err: Error, client: pg.Client)=>
            { 
                client.query('INSERT INTO Users(name, encryptedpassword) VALUES($1, $2) RETURNING id', [uname, upassword], function(err, result) {
                            // you MUST return your client back to the pool when you're done!
                            //console.log(result.rows[0].name); // output: foo
                            let newid =  result.rows[0].name;
                            
                            });
            });
            pg.connect(this.connectionString, callback);
            
        };

        findany (username: string) 
        {
            let qrm = this.pgp.queryResult;
            return this.db.one('select * from users WHERE name =$1', 'red');
            
        //     .then(data=> {
        // // success;
        // let x = data.rows[0];
        // return x;
        //             })
        //             .catch(error=> {
        // // error;
        // let x=1;
        // })


        };

        findbyusername (username: string) 
        {
            let callback = ((err: Error, client: pg.Client)=>
            { 
                client.query('SELECT * FROM Users WHERE name = $1', [username], function(err, result) {
                            // you MUST return your client back to the pool when you're done!
                            //console.log(result.rows[0].name); // output: foo
                            let newid =  result.rows[0].id;
                            let name =  result.rows[0].name;
                            
                            });
            });
            pg.connect(this.connectionString, callback);
        }

        // remove = (id:number) => this.db.result('DELETE FROM Products WHERE id = $1', id)
        //     .then((result:any) => result.rowCount);

        // find = (id:number) => this.db.oneOrNone('SELECT * FROM Products WHERE id = $1', id);

        // all = () => this.db.any('SELECT * FROM Products');

        
        // total = () => this.db.one('SELECT count(*) FROM Products')
        //     .then((data:any) => parseInt(data.count));
    }
