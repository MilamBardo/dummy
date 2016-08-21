function repUsers(obj) {
    return {
        // Add a new user record, given name + active values, and return the new id
        add: function (postTitle, postBody) {
            return obj.one("INSERT INTO posts(postTitle, postBody) VALUES($1, $2) RETURNING id",
                [postTitle, postBody])
                .then(data=> {
                    return data.id;
                });
        }
    }
}