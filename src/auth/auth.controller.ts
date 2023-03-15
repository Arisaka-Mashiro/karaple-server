import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/signin')
  @UseGuards(AuthGuard('google'))
  public async googleSignIn() {
    // 구글 로그인으로 넘어감
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  public async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = this.authService.googleSignIn(req);
    const accessToken = this.authService.signIn(user);
    res.cookie('Authentication', accessToken, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
    res.redirect(`http://${process.env.DOMAIN}/`);
  }
}
