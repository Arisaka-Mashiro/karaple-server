import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/strategy/jwt';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';

@Module({
  controllers: [PlaylistController],
  providers: [JwtStrategy, PlaylistService]
})
export class PlaylistModule {}
