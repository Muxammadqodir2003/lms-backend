import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStartegy } from './strategies/github.strategy';
import { TokenService } from 'src/token/token.service';
import { TokenModule } from 'src/token/token.module';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TokenModule],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    GoogleStrategy,
    GithubStartegy,
    TokenService,
    JwtService,
    RedisService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
