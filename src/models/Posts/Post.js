"use strict";
/// <reference path="../Images/ImageInfo.ts"/> 
var Posts;
(function (Posts) {
    class Post {
        constructor(postTitle, postBody) {
            this.postTitle = postTitle;
            this.postBody = postBody;
            this.postDate = new Date();
        }
        get postImage() {
            return this._postImage;
        }
        set postImage(img) {
            this._postImage = img;
        }
    }
    Posts.Post = Post;
})(Posts = exports.Posts || (exports.Posts = {}));
//# sourceMappingURL=Post.js.map