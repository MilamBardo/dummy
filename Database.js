var pg = require('pg');

//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/Almos';
//var connectionString = 'postgres://' + sourceConfig.user + ':' + sourceConfig.password + '@' + sourceConfig.host + ':' + sourceConfig.port + '/' + sourceConfig.database;
var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE Posts(id SERIAL PRIMARY KEY, postTitle VARCHAR(200) not null, postBody TEXT not null, postdate TIMESTAMP not null)');
query.on('end', function() { client.end(); });

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE Users(id SERIAL PRIMARY KEY, name VARCHAR(200) not null, encryptedpassword varchar(300) not null, isadmin BOOLEAN not null DEFAULT FALSE, created TIMESTAMP with time zone not null DEFAULT NOW())');
query.on('end', function() { client.end(); });