import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Brand } from './interfaces/brand';
import { SearchType } from './interfaces/searchType';

@Injectable()
export class MusicService {
  constructor(private readonly httpService: HttpService) {}

  private async searchFromManana(keyword: string, type: SearchType, brand: Brand) {
    try {
      let url = `https://api.manana.kr/karaoke/${type === SearchType.SONG_NAME ? 'song' : 'singer'}/${encodeURIComponent(keyword)}.json${brand ? `?brand=${brand}` : ''}`;
      const { data } = await this.httpService.axiosRef.get(url);
      
      if (data?.length > 0) {
        return data.map(x => {
          return {
            brand: x?.brand,
            title: x?.title,
            artist: x?.singer,
            no: x?.no,
          };
        });
      }
      
      return [];
    } catch (e) {
      throw e;
    }
  }

  private async searchFromJoysound(keyword: string) {
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
      const { data, status } = await this.httpService.axiosRef.post(url, params, {
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
      throw e;
    }
  }

  public async search(keyword: string, type: SearchType, brand: Brand) {
    try {
      if (!type) {
        type = SearchType.SONG_NAME;
      }

      const results = [];
      const [result1, result2, result3] = await Promise.all([
        this.searchFromManana(keyword, type, Brand.TJ),
        this.searchFromManana(keyword, type, Brand.KUMYOUNG),
        this.searchFromJoysound(keyword),
      ]);
      [...result1, ...result2, ...result3].forEach((item) => {
        if (!results.find(x => x.no === item.no)) {
          results.push(item);
        }
      });

      return results;
    } catch (e) {
      throw e;
    }
  }
}
