
    export class ImageInfo
    {
        imageid : number;
        imagename : string;
        imagefilepath: string;
        imagetitle : string;
        imagealt: string;
        datecreated : Date;
        
        constructor(filename : string, path : string, alt : string, title : string)
        {
            this.imagename = filename+ "_"+ (new Date().toDateString());
            this.imagefilepath = path;
            this.imagealt = alt;
            this.imagetitle = title;
            this.datecreated = new Date();
        }
    }

    export class GalleryImage
    {
        galleryimageid : number;
        galleryid : number;
        imageid : number;
        galleryimageordernumber: number;
        galleryimagecaption : string;
        sizecontrollingdimension : string;
        sizecontrollingpercentage : string;
        datecreated : Date;
        
        constructor(galleryid : number, imageid : number, order : number, dimension : string, percentage : string)
        {
            this.galleryid = galleryid;
            this.imageid = imageid;
            this.galleryimageordernumber = order;
            this.sizecontrollingdimension = dimension;
            this.sizecontrollingpercentage = percentage;
            this.datecreated = new Date();
        }
    }

    export class Gallery
    {
        galleryid : number;
        galleryname : string;
        isdefault : boolean;
        isprivate : boolean;
        datecreated : Date;
        galleryimages : Array<number>;
        
        constructor(name : string)
        {
            this.galleryname = name;
            this.isdefault = false;
            this.isprivate = false;
            this.datecreated = new Date();
        }
    }
