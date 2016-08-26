//import sqlProvider = require('../sql');
//var sql = sqlProvider.products;
"use strict";
const dbProvider = require('../../db');
class userRepository {
    constructor() {
        this.db = dbProvider.dbpool;
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
    // add (u: Users.Users.User) 
    // { 
    //     let uname = u.name;
    //     let upassword = u.encryptedpassword;
    //     let callback = ((err: Error, client: pg.Client)=>
    //     { 
    //         client.query('INSERT INTO Users(name, encryptedpassword) VALUES($1, $2) RETURNING id', [uname, upassword], function(err, result) {
    //                     // you MUST return your client back to the pool when you're done!
    //                     //console.log(result.rows[0].name); // output: foo
    //                     let newid =  result.rows[0].name;
    //                     });
    //     });
    //     pg.connect(this.connectionString, callback);
    // };
    add(user) {
        //var name = user.name;
        //var en
        return this.db.one("INSERT INTO Users(name, encryptedpassword, email, created) VALUES($1, $2, $3, $4) RETURNING id", [user.name, user.encryptedpassword, user.email, user.createddate]);
    }
    ;
    verify(user) {
        return this.db.one("Update Users SET IsVerified = $1 WHERE name=$2 and email=$3 VALUES($1, $2, $3) RETURNING id", [true, user.name, user.email]);
    }
    ;
    findany(username) {
        return this.db.one('select * from users WHERE name =$1', username);
    }
    ;
    findbyusername(username) {
        return this.db.one('select * from users WHERE name =$1', username);
    }
    ;
}
exports.userRepository = userRepository;
//# sourceMappingURL=userRepository.js.map