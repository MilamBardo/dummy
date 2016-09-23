/// <reference path="../Images/ImagesModule.ts"/>
import * as Images from "../Images/ImagesModule.ts"

export class Post {
    id : number;
    posttitle : string;
    postbody : string;
    postdate : Date; 
    image :  Images.ImageInfo
    //postimages: Array< ImageInfo>;
    //_postimage : Images.ImageInfo;
    
  constructor(postTitle : string, postBody : string) {
    this.posttitle = postTitle;
    this.postbody = postBody;
    this.postdate = new Date();
  }

}

export class PostImage {
    postimageid : number;
    postid : number;
    imageid : number;
    postimagecaption: string;
    sizecontrollingdimension: string;
    sizecontrollingpercentage: string;
    imagetype : string;
    imagetypeorder: number;
    datecreated : Date; 
    //_postimage : Images.ImageInfo;
    
  constructor(postid : number, imageid : number) {
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