import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Brand } from './interfaces/brand';
import { SearchType } from './interfaces/searchType';
import * as cheerio from 'cheerio';
import { Music } from './interfaces/music';

@Injectable()
export class MusicService {
  constructor() {}

  private async searchFromTj(keyword: string, type: SearchType): Promise<Music[]> {
    try {
      const musics: Music[] = [];
      const form = {
        searchOrderItem: '',
        searchOrderType: '',
        strCond: 1,
        natType: '',
        strType: (() => {
          if (type === SearchType.SONG_NAME) return 1;
          if (type === SearchType.ARTIST_NAME) return 2;
        })(),
        strText: keyword
      };
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(form)) {
        params.append(key, value.toString());
      }
     const { data, status } = await axios({
        method: 'POST',
        url: 'https://www.tjmedia.com/tjsong/song_search_list.asp',
        data: params,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
          'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7,zh-CN;q=0.6,zh;q=0.5,ja;q=0.4',
          'Origin': 'https://www.tjmedia.com',
          'Referer': 'https://www.tjmedia.com/tjsong/song_search_list.asp',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });

      const doc = cheerio.load(data);
      const rows = doc('table.board_type1:last tr');
      if (doc(rows[1]).html().includes('검색 결과를 찾을 수 없습니다')) {
        return [];
      } else {
        rows.each((i, element) => {
          if (i > 0) {
            const row = doc(element).find('td');
            musics.push(new Music({
              no: doc(row[0]).text(),
              title: doc(row[1]).text(),
              artist: doc(row[2]).text(),
              brand: Brand.TJ,
            }))
          }
        });
      }

      return musics;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async searchFromGeumyoung(keyword: string, type: SearchType) {
    
  }

  private async searchFromJoysound(keyword: string, type: SearchType): Promise<Music[]> {
    try {
      let url = `https://mspxy.joysound.com/Common/ContentsList`;
      const form = {
        kind1: 'compound',
        word1: keyword,
        match1: 'partial',
        kindCnt: 1,
        format: 'group',
        start: 1,
        count: 5,
        sort: 'popular',
        order: 'desc',
        apiVer: '1.0'
      };
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(form)) {
        params.append(key, value.toString());
      }
      const { data, status } = await axios({
        url,
        method: 'POST',
        data: params,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
          'Accept-Language': 'ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7,zh-CN;q=0.6,zh;q=0.5,ja;q=0.4',
          'Origin': 'https://www.joysound.com',
          'Referer': 'https://www.joysound.com/',
          'x-jsp-app-name': '0000800',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
      const lists = data?.contentsList;
      if (lists?.length > 0) {
        return lists.map(x => {
          return {
            brand: Brand.JOYSOUND,
            title: x?.songName,
            artist: x?.artistName,
            no: x?.selSongNo,
          };
        });
      }
      
      return [];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async search(keyword: string, type: SearchType, brand: Brand) {
    try {
      if (!type) {
        type = SearchType.SONG_NAME;
      }

      switch (brand) {
        case Brand.TJ:
          return this.searchFromTj(keyword, type);
        case Brand.JOYSOUND:
          return this.searchFromJoysound(keyword, type);
      }
    } catch (e) {
      throw e;
    }
  }
}
