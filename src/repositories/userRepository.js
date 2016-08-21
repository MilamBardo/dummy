//import sqlProvider = require('../sql');
//var sql = sqlProvider.products;
"use strict";
/// <reference path='../../typings/globals/pgpromise/pg-promise.d.ts' />
/// <reference path='../../typings/index.d.ts'/>
const pg = require('pg');
const pgPromise = require('pg-promise');
class userRepository {
    // constructor(db:any) {
    //     this.db = db;
    // }
    constructor() {
        this.pgp = pgPromise({});
        this.connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';
        this.db = this.pgp(this.connectionString);
        this.config = {
            host: 'localhost',
            user: 'Almos',
            database: 'Almos',
            password: 'Talanath5',
            port: 5432 //env var: PGPORT
        };
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
    add(u) {
        let uname = u.name;
        let upassword = u.encryptedpassword;
        let callback = ((err, client) => {
            client.query('INSERT INTO Users(name, encryptedpassword) VALUES($1, $2) RETURNING id', [uname, upassword], function (err, result) {
                // you MUST return your client back to the pool when you're done!
                //console.log(result.rows[0].name); // output: foo
                let newid = result.rows[0].name;
            });
        });
        pg.connect(this.connectionString, callback);
    }
    ;
    findany(username) {
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
    }
    ;
    findbyusername(username) {
        let callback = ((err, client) => {
            client.query('SELECT * FROM Users WHERE name = $1', [username], function (err, result) {
                // you MUST return your client back to the pool when you're done!
                //console.log(result.rows[0].name); // output: foo
                let newid = result.rows[0].id;
                let name = result.rows[0].name;
            });
        });
        pg.connect(this.connectionString, callback);
    }
}
exports.userRepository = userRepository;
//# sourceMappingURL=userRepository.js.map