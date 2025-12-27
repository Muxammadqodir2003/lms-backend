import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [TokenService, JwtService, ConfigService, PrismaService],
  exports: [TokenService],
})
export class TokenModule {}
