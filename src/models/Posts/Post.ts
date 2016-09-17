/// <reference path="../Images/ImageInfo.ts"/> 
export module Posts
{
    
export class Post {
    id : number;
    posttitle : string;
    postbody : string;
    postdate : Date; 
    _postimage : Images.ImageInfo;
    
  constructor(postTitle : string, postBody : string) {
    this.posttitle = postTitle;
    this.postbody = postBody;
    this.postdate = new Date();
  }
 
  get postImage()
  {
      return this._postimage;
  }
  set postImage(img : Images.ImageInfo)
  {
      this._postimage = img;
  }
//   get area() {
//     return this.calcArea();
//   }

//   calcArea() {
//     return this.height * this.width;
//   }
}
}