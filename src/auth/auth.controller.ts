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
import { Throttle } from '@nestjs/throttler';
import { RATE_LIMIT } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Throttle({
    default: { limit: RATE_LIMIT.REGISTER.limit, ttl: RATE_LIMIT.REGISTER.ttl },
  })
  @Post('register')
  async register(@Body() body: { email: string }) {
    return await this.authService.register(body.email);
  }

  @Throttle({
    default: { limit: RATE_LIMIT.VERIFY.limit, ttl: RATE_LIMIT.VERIFY.ttl },
  })
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

  @Throttle({
    default: { limit: RATE_LIMIT.LOGIN.limit, ttl: RATE_LIMIT.LOGIN.ttl },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];
    const data = await this.authService.login(loginDto, ip, userAgent);
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

  @Throttle({
    default: { limit: RATE_LIMIT.REGISTER.limit, ttl: RATE_LIMIT.REGISTER.ttl },
  })
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleLogin() {}

  @Throttle({
    default: { limit: RATE_LIMIT.REGISTER.limit, ttl: RATE_LIMIT.REGISTER.ttl },
  })
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

  @Throttle({
    default: { limit: RATE_LIMIT.REGISTER.limit, ttl: RATE_LIMIT.REGISTER.ttl },
  })
  @UseGuards(AuthGuard('github'))
  @Get('github')
  async githubLogin() {}

  @Throttle({
    default: { limit: RATE_LIMIT.REGISTER.limit, ttl: RATE_LIMIT.REGISTER.ttl },
  })
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

  @Throttle({
    default: { limit: RATE_LIMIT.RECOVERY.limit, ttl: RATE_LIMIT.RECOVERY.ttl },
  })
  @Post('recovery-account/:token')
  async recoveryAccount(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    console.log(token, body.password);
    return this.authService.recoveryAccount(token, body.password);
  }
}
