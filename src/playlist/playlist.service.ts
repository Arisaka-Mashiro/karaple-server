import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PlayList } from './interfaces/playlist';
import { PlayListItem } from './interfaces/playlist.item';
import { Thumbnail, Thumbnails } from './interfaces/thumbnails';

@Injectable()
export class PlaylistService {
  public async getChannels(accessToken: string) {
    try {
      const service = google.youtube('v3');
      const { data } = await service.channels.list({
        part: ["id", "contentDetails", "snippet"],
        access_token: accessToken,
        mine: true,
      });

      return data;
    } catch (e) {
      throw e;
    }
  };

  public async getPlayLists(accessToken: string) {
    try {
      const service = google.youtube('v3');
      const channels = await this.getChannels(accessToken);
      const { data } = await service.playlists.list({
        part: ["id", "snippet"],
        access_token: accessToken,
        mine: true,
        maxResults: 50,
      });
      const likePlaylists = channels.items.map(p => {
        return new PlayList({
          id: p.contentDetails.relatedPlaylists.likes,
          publishedAt: p.snippet.publishedAt,
          title: `${p.snippet.title}가 좋아요 표시한 동영상`,
          thumbnails: new Thumbnails({
            default: new Thumbnail({
              url: null,
              width: null,
              height: null,
            })
          })
        });
      });
      const playlists = data.items.map(p => {
        return new PlayList({
          id: p.id,
          publishedAt: p.snippet.publishedAt,
          title: p.snippet.title,
          thumbnails: new Thumbnails({
            default: new Thumbnail({
              url: p.snippet.thumbnails.default.url,
              width: p.snippet.thumbnails.default.width,
              height: p.snippet.thumbnails.default.height,
            })
          })
        });
      })

      return [...likePlaylists, ...playlists];
    } catch (e) {
      throw e;
    }
  };
  
  private async fetchPlayListItems(accessToken: string, playListId: string, nextToken: string): Promise<[PlayListItem[], string]> {
    try {
      const service = google.youtube('v3');
      const channels = this.getChannels(accessToken);
      const { data } = await service.playlistItems.list({
        part: ["id", "snippet", "contentDetails"],
        access_token: accessToken,
        playlistId: playListId,
        maxResults: 50,
        pageToken: nextToken,
      });
      const results = data.items.map(x => {
        return new PlayListItem({
          id: x.id,
          url: `https://www.youtube.com/watch?v=${x.contentDetails.videoId}`,
          publishedAt: x.snippet.publishedAt,
          title: x.snippet.title,
          videoOwnerChannelTitle: x.snippet.videoOwnerChannelTitle,
          thumbnails: new Thumbnails({
            default: new Thumbnail({
              url: x.snippet?.thumbnails?.default?.url,
              width: x.snippet?.thumbnails?.default?.width,
              height: x.snippet?.thumbnails?.default?.height,
            })
          })
        });
      });

      return [results, data.nextPageToken];
    } catch (e) {
      throw e;
    }
  };

  public async getPlayListItems(accessToken: string, playListId: string) {
    try {
      const playlistItems: PlayListItem[] = [];
      let token: string;

      while (true) {
        const [results, nextToken] = await this.fetchPlayListItems(accessToken, playListId, token);
        token = nextToken;
        playlistItems.push(...results);
        if (!nextToken) {
          break;
        }
      }

      return playlistItems;
    } catch (e) {
      throw e;
    }
  };
}
