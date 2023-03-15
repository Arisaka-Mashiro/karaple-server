import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  public async getPlaylist(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    const lists = await this.playlistService.getPlayLists(user.googleAccessToken);
    res.status(200).send(lists);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getPlaylistItems(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    const { user } = req;
    const lists = await this.playlistService.getPlayListItems(user.googleAccessToken, id);
    res.status(200).send(lists);
  }
}
