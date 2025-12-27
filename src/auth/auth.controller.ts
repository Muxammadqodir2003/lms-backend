import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { Cookies } from './decorators/cookie.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string }) {
    return await this.authService.register(body.email);
  }

  @Post('verify')
  async verify(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.verify(registerDto);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
    });
    return data;
  }

  @Delete('delete')
  async get() {
    try {
      return await this.authService.deleteAll();
    } catch (error) {
      console.log(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
    });
    return data;
  }

  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
    });
    return data;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleLogin() {}

  @UseGuards(AuthGuard('google'))
  @Get('callback/google')
  async googleLoginRedirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const data = req.user;
    res.cookie('refreshToken', data['refreshToken'], {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return res.redirect(
      `${this.config.get('CLIENT_URL')}/auth/success?token=${data['accessToken']}`,
    );
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  async githubLogin() {}

  @UseGuards(AuthGuard('github'))
  @Get('callback/github')
  async githubLoginRedirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const data = req.user;
    res.cookie('refreshToken', data['refreshToken'], {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    res.redirect(
      `${this.config.get('CLIENT_URL')}/auth/success?token=${data['accessToken']}`,
    );
  }

  @Post('get-url')
  async getRecoveryUrl(@Body() body: { email: string }) {
    return this.authService.getRecoveryUrl(body.email);
  }

  @Post('recovery-account/:token')
  async recoveryAccount(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    console.log(token, body.password);
    return this.authService.recoveryAccount(token, body.password);
  }
}
