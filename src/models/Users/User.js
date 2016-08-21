"use strict";
var Users;
(function (Users) {
    class User {
        constructor(username, userPassword) {
            this.name = username;
            this.encryptedpassword = userPassword;
            this.createddate = new Date();
        }
    }
    Users.User = User;
})(Users = exports.Users || (exports.Users = {}));
//# sourceMappingURL=User.js.map