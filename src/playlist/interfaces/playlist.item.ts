import { Thumbnails } from "./thumbnails";

export class PlayListItem {
  constructor(init: PlayListItem) {
    Object.assign(this, init);
  }

  id: string;
  url: string;
  publishedAt: string;
  title: string;
  videoOwnerChannelTitle: string;
  thumbnails: Thumbnails;
}