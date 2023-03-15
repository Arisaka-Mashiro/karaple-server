import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { type } from 'os';
import { Brand } from './interfaces/brand';
import { SearchType } from './interfaces/searchType';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('search/:keyword')
  public async search(
    @Res() res: Response, 
    @Param('keyword') keyword: string, 
    @Query('type') type: SearchType, 
    @Query('brand') brand: Brand
  ) {
    const lists = await this.musicService.search(keyword, type, brand);
    res.status(200).send(lists);
  }
}
