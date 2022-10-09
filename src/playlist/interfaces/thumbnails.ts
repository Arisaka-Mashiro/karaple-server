export class Thumbnails {
    constructor(init: Partial<Thumbnails>) {
      Object.assign(this, init);
    }
  
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard: Thumbnail;
    maxres: Thumbnail;
  }
  
  export class Thumbnail {
    constructor(init: Thumbnail) {
      Object.assign(this, init);
    }
  
    url: string;
    width: number;
    height: number;
  }