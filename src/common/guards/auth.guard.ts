import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException('Yaroqsiz token');

    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Yaroqsiz token');

    const payload = this.tokenService.validateAccessToken(token);
    if (!payload) throw new UnauthorizedException('Yaroqsiz token');

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: String(payload.userId) },
      });

      if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

      req['user'] = user;
      return true;
    } catch (error) {
      console.error('DATABASE ERROR IN GUARD:', error);
      throw new UnauthorizedException('Yaroqsiz token');
    }
  }
}
