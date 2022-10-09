import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
  imports: [HttpModule],
  controllers: [MusicController],
  providers: [MusicService]
})
export class MusicModule {}
