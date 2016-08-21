 export module Users
 {
    export class User {
        
        id : string;
        name : string;
        encryptedpassword : string;
        email : string;
        accountverified : boolean;
        isadmin : boolean;
        createddate : Date; 
        
        constructor(username : string, userPassword : string) {
            this.name = username;
            this.encryptedpassword = userPassword;
            this.createddate = new Date();
        }
    }
}