"use strict";
class Post {
    //postimages: Array< ImageInfo>;
    //_postimage : Images.ImageInfo;
    constructor(postTitle, postBody) {
        this.posttitle = postTitle;
        this.postbody = postBody;
        this.postdate = new Date();
    }
}
exports.Post = Post;
class PostImage {
    //_postimage : Images.ImageInfo;
    constructor(postid, imageid) {
        this.postid = postid;
        this.imageid = imageid;
        this.datecreated = new Date();
        //defaults
        this.imagetype = "Main";
        this.imagetypeorder = 0;
        this.sizecontrollingdimension = "width";
        this.sizecontrollingpercentage = "50%";
    }
}
exports.PostImage = PostImage;
//# sourceMappingURL=PostsModule.js.map