"use strict";
class Post {
    //postimages: Array< ImageInfo>;
    //_postimage : Images.ImageInfo;
    //constructor(postTitle : string, postBody : string);
    constructor(postTitle, postBody, id, postURL, postDate) {
        this.setPostTitle(postTitle);
        this.postbody = postBody;
        this.id = id != null ? id : null;
        this.postdate = postDate != null ? postDate : new Date();
    }
    setPostTitle(postTitle) {
        this.posttitle = postTitle;
        this.posturl = postTitle.replace(/\s/g, "-");
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