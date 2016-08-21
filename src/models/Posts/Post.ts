/// <reference path="../Images/ImageInfo.ts"/> 
export module Posts
{
    
export class Post {
    
    postTitle : string;
    postBody : string;
    postDate : Date; 
    _postImage : Images.ImageInfo;
    
  constructor(postTitle : string, postBody : string) {
    this.postTitle = postTitle;
    this.postBody = postBody;
    this.postDate = new Date();
  }
 
  get postImage()
  {
      return this._postImage;
  }
  set postImage(img : Images.ImageInfo)
  {
      this._postImage = img;
  }
//   get area() {
//     return this.calcArea();
//   }

//   calcArea() {
//     return this.height * this.width;
//   }
}
}