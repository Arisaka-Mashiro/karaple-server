import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public googleSignIn(req: Request) {
    if (req.user) {
      return req.user;
    }

    return null;
  }

  public signIn(user: Express.User) {
    const payload = {
      provider: user.provider,
      providerId: user.providerId,
      name: user.name,
      email: user.email,
      sub: user.providerId,
      googleAccessToken: user.accessToken
    };

    return this.jwtService.sign(payload);
  }
}
