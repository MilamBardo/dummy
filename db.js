// /// <reference path='./typings/index.d.ts'/>
// /// <reference path='./node_modules/pg-promise/typescript/pg-promise.d.ts'/>
// /// <reference path='./node_modules/pg-promise/typescript/ext-promise.d.ts'/>
"use strict";
const pg = require('pg');
class dbpool {
    constructor() {
        this.connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';
        var config = {
            user: 'Almos',
            database: 'Almos',
            password: 'Talanath5',
            port: 5432 //env var: PGPORT
        };
        this.clientpool = pg.pools.getOrCreate(config);
    }
}
//  import * as promise from 'bluebird';
//  import * as pgPromise from 'pg-promise';
// import users = require('./src/repositories/userRepository.ts');
// interface IExtensions {
//     users:users.userRepository;
// }
// var options = {
//     promiseLib: Promise,
//     extend: (obj:any) => {
//         obj.users = new users.userRepository(obj);
//     }
// };
// var config = {
//     host: 'localhost',
//     port: 5432,
//     database: 'pg-promise-demo',
//     user: 'postgres'
// };
// var pgp = pgPromise(options);
// var db = <pgPromise.IDatabase<IExtensions>&IExtensions>pgp(config);
// export = {
//     pgp,
//     db
// }; 
//# sourceMappingURL=db.js.map