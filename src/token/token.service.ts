import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { userId },
      {
        secret: this.config.get<string>('ACCESS_JWT_SECRET'),
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: this.config.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: '30d',
      },
    );

    return { accessToken, refreshToken };
  }

  async findToken(refreshToken: string) {
    return await this.prismaService.token.findUnique({
      where: { refreshToken },
    });
  }

  async saveToken(refreshToken: string, userId: string) {
    if (!refreshToken || !userId)
      throw new UnauthorizedException(
        'Token yoki foydalanuvchi malumotlari topilmadi',
      );
    await this.prismaService.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { refreshToken, userId },
    });
  }

  validateRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('REFRESH_JWT_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_JWT_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }

  generateRecoveryToken(userId: string) {
    const token = this.jwtService.sign(
      { userId },
      { secret: this.config.get('RECOVERY_TOKEN'), expiresIn: '5m' },
    );
    return token;
  }

  validateRecoveryToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.config.get('RECOVERY_TOKEN'),
      });
    } catch (error) {
      return null;
    }
  }
}
