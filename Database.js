var pg = require('pg');

//LOCAL
var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';

//Local2 Almos
//var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@127.0.0.1:5432/Almos';

//Local3 NodeUser Talanath5
//LIVE
//var connectionString = process.env.DATABASE_URL || 'postgres://nodeuser:Talanath5@127.0.0.1:5432/Almos';

// var client1 = new pg.Client(connectionString);
// client1.connect();
// var query1 = client1.query('CREATE TABLE public.users (id SERIAL PRIMARY KEY, name character varying(200) NOT NULL, encryptedpassword character varying(300) NOT NULL, email character varying(200) NOT NULL, lockedout boolean NOT NULL, loginattempts integer NOT NULL, isadmin boolean NOT NULL DEFAULT false, isverified boolean NOT NULL DEFAULT false, created timestamp with time zone NOT NULL DEFAULT NOW());');
// query1.on('end', function() { client1.end(); });

// var client2 = new pg.Client(connectionString);
// client2.connect();
// var query2 = client2.query('CREATE TABLE public.posts(id SERIAL PRIMARY KEY, posttitle character varying(200) NOT NULL,postbody text NOT NULL,postdate timestamp without time zone NOT NULL);');
// query2.on('end', function() { client2.end(); });

// var client3 = new pg.Client(connectionString);
// client3.connect();
// var query3 = client3.query('CREATE TABLE public.session (sid character varying NOT NULL, sess json NOT NULL, expire timestamp(6) without time zone NOT NULL, CONSTRAINT session_pkey PRIMARY KEY (sid)) WITH ( OIDS=FALSE)');
// query3.on('end', function() { client3.end(); });

var client4 = new pg.Client(connectionString);
client4.connect();
var query4 = client4.query('CREATE TABLE public.uploadedimages(id SERIAL PRIMARY KEY, imagelocation character varying(200) NOT NULL, imagename character varying(200) NOT NULL, imagealt character varying(200) NOT NULL,caption text NOT NULL, datecreated timestamp without time zone NOT NULL);');
query4.on('end', function() { client4.end(); });

var client5 = new pg.Client(connectionString);
client5.connect();
var query5 = client5.query('CREATE TABLE public.postimages(id SERIAL PRIMARY KEY, imagelocation character varying(200) NOT NULL, imagename character varying(200) NOT NULL, imagealt character varying(200) NOT NULL,caption text NOT NULL, datecreated timestamp without time zone NOT NULL);');
query5.on('end', function() { client5.end(); });