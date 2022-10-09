import { Thumbnails } from "./thumbnails";

export class PlayList {
  constructor(init: PlayList) {
    Object.assign(this, init);
  }

  id: string;
  publishedAt: string;
  title: string;
  thumbnails: Thumbnails;
}