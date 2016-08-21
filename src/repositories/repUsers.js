// Users repository
function repUsers() {

    var pg = require('pg');
    var connectionString = process.env.DATABASE_URL || 'postgres://Almos:Talanath5@localhost:5432/Almos';

    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
    });

        return {
            // Add a new user record, given name + active values, and return the new id
            add: function (user) {
                //var name = user.name;
                //var en
                return pg.one("INSERT INTO Users(name, encryptedpassword, active) VALUES($1.name, $2) RETURNING id",
                    [name, active])
                    .then(data=> {
                        return data.id;
                    });
            },
            // Get number of active users
            count: function () {
                return pg.one("SELECT count(*) FROM Users")
                    .then(data=> {
                        return data.count;
                    });
            },
            // Find id-s of all users that have a given name
            find: function (name) {
                return pg.any("SELECT id from Users WHERE name = $1", name)
                    .then(data=> {
                        return data.map(m=> {
                            return m.id;
                        });
                    });
            },
            // Set active flag for a user by name, or create a new one, if none found, return id-s
            activate: function (name, active) {
                return pg.tx("activate", function*() {
                    let r = yield this.any("UPDATE Users SET active=$1 WHERE name=$2 RETURNING id",
                        [active, name]);
                    if (r.length) {
                        return r.map(m=> {
                            return m.id;
                        });
                    }
                    let userId = yield this.users.add(name, active);
                    return [userId];
                });
            },
            // Delete users by name and return the number of users deleted
            delete: function (name) {
                return pg.result("DELETE FROM Users WHERE name=$1", name)
                    .then(result=> {
                        return result.rowCount;
                    });
            }
        }
}