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
        
        constructor(username : string, hashedPassword : string, email: string) {
            this.name = username;
            this.encryptedpassword = hashedPassword;
            this.email = email;
            this.createddate = new Date();
        }

    }
}