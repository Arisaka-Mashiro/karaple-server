import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
