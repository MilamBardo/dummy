var pg = require('pg');

//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/Almos';
//var connectionString = 'postgres://' + sourceConfig.user + ':' + sourceConfig.password + '@' + sourceConfig.host + ':' + sourceConfig.port + '/' + sourceConfig.database;

//LOCAL
var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';
//LIVE
//var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@10.128.27.239:5432/Almos';

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE Posts(id SERIAL PRIMARY KEY, postTitle VARCHAR(200) not null, postBody TEXT not null, postdate TIMESTAMP not null)');
// query.on('end', function() { client.end(); });

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE Users(id SERIAL PRIMARY KEY, name VARCHAR(200) not null, encryptedpassword varchar(300) not null, email varchar(200) not null, isadmin BOOLEAN not null DEFAULT FALSE, isverified BOOLEAN not null DEFAULT FALSE, created TIMESTAMP with time zone not null DEFAULT NOW())');
// query.on('end', function() { client.end(); });

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE session(sid character varying NOT NULL, sess json NOT NULL, expire timestamp(6) without time zone NOT NULL, )');
// query.on('end', function() { client.end(); });

var client1 = new pg.Client(connectionString);
client1.connect();
var query1 = client1.query('CREATE TABLE public.users (id SERIAL PRIMARY KEY, name character varying(200) NOT NULL, encryptedpassword character varying(300) NOT NULL, email character varying(200) NOT NULL, isadmin boolean NOT NULL DEFAULT false, isverified boolean NOT NULL DEFAULT false, created timestamp with time zone NOT NULL DEFAULT NOW());');
query1.on('end', function() { client1.end(); });

var client2 = new pg.Client(connectionString);
client2.connect();
var query2 = client2.query('CREATE TABLE public.posts(id SERIAL PRIMARY KEY, posttitle character varying(200) NOT NULL,postbody text NOT NULL,postdate timestamp without time zone NOT NULL);');
query2.on('end', function() { client2.end(); });

var client3 = new pg.Client(connectionString);
client3.connect();
var query3 = client3.query('CREATE TABLE public.session (sid character varying NOT NULL, sess json NOT NULL, expire timestamp(6) without time zone NOT NULL, CONSTRAINT session_pkey PRIMARY KEY (sid)) WITH ( OIDS=FALSE)');
query3.on('end', function() { client3.end(); });