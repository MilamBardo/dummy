"use strict";
var Users;
(function (Users) {
    class User {
        constructor(username, hashedPassword, email) {
            this.name = username;
            this.encryptedpassword = hashedPassword;
            this.email = email;
            this.createddate = new Date();
        }
    }
    Users.User = User;
})(Users = exports.Users || (exports.Users = {}));
//# sourceMappingURL=User.js.map