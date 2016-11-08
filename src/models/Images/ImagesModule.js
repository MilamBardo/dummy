"use strict";
class ImageInfo {
    constructor(filename, path, alt, title, height, width) {
        this.imagename = filename + "_" + (new Date().toDateString());
        this.imagefilepath = path;
        this.imagealt = alt;
        this.imagetitle = title;
        this.datecreated = new Date();
        this.height = height;
        this.width = width;
        if (height == width) {
            this.orientation = "S";
        } //square
        else if (height > width) {
            this.orientation = "P";
        } //portrait
        else {
            this.orientation = "L";
        } //landscape
    }
}
exports.ImageInfo = ImageInfo;
class GalleryImage {
    constructor(galleryid, imageid, order, dimension, percentage) {
        this.galleryid = galleryid;
        this.imageid = imageid;
        this.galleryimageordernumber = order;
        this.sizecontrollingdimension = dimension;
        this.sizecontrollingpercentage = percentage;
        this.datecreated = new Date();
    }
}
exports.GalleryImage = GalleryImage;
class Gallery {
    constructor(name) {
        this.galleryname = name;
        this.isdefault = false;
        this.isprivate = false;
        this.datecreated = new Date();
    }
}
exports.Gallery = Gallery;
//# sourceMappingURL=ImagesModule.js.map