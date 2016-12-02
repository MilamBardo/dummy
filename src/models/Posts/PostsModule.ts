/// <reference path="../Images/ImagesModule.ts"/>
import * as Images from "../Images/ImagesModule"

export class Post {
    id : number;
    posttitle : string;
    posturl : string;
    postbody : string;
    postdate : Date; 
    image :  Images.ImageInfo
    //postimages: Array< ImageInfo>;
    //_postimage : Images.ImageInfo;
    
  //constructor(postTitle : string, postBody : string);
  constructor(postTitle : string, postBody : string, id? : number, postURL? : string, postDate? : Date)
  {
    this.setPostTitle(postTitle);
    this.postbody = postBody;
    this.id = id != null ? id : null;
    this.postdate = postDate != null ? postDate : new Date();
    
  }

  public setPostTitle(postTitle : string)
  {
    this.posttitle = postTitle;
    this.posturl = postTitle.replace(' ', '-');
  }

  // public getPostTitle()
  // {
  //   return this._posttitle;
  // }

  // public getPostURL()
  // {
  //   return this._posturl;
  // }
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