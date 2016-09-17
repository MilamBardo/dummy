"use strict";
/// <reference path="../Images/ImageInfo.ts"/> 
var Posts;
(function (Posts) {
    class Post {
        constructor(postTitle, postBody) {
            this.posttitle = postTitle;
            this.postbody = postBody;
            this.postdate = new Date();
        }
        get postImage() {
            return this._postimage;
        }
        set postImage(img) {
            this._postimage = img;
        }
    }
    Posts.Post = Post;
})(Posts = exports.Posts || (exports.Posts = {}));
//# sourceMappingURL=Post.js.map