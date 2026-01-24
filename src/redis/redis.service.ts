import { ForbiddenException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly prismaService: PrismaService,
  ) {}

  async verifyOtp(email: string, otp: number) {
    const redisOtp = await this.redis.get(`otp:${email}`);
    if (otp.toString() === redisOtp) {
      await this.redis.del(`otp:${email}`);
      return true;
    } else {
      return false;
    }
  }

  async login(
    redisUserKey: string,
    user: { id: string },
    ip: string,
    userAgent: string,
  ) {
    const isBlock = await this.redis.get(redisUserKey);
    if (isBlock) {
      throw new ForbiddenException(
        'Account temporarily locked. Try again later.',
      );
    }

    const attempts = await this.redis.incr(redisUserKey);
    if (attempts === 1) {
      await this.redis.expire(redisUserKey, 600);
    }

    if (attempts >= 3) {
      await this.redis.set(redisUserKey, 'true', 'EX', 900);

      await this.prismaService.log.create({
        data: {
          userId: user.id,
          ipAddress: ip,
          userAgent: userAgent,
          reason: 'Too many failed login attempts',
        },
      });
    }
  }

  async deleteLoginBlock(redisUserKey: string) {
    await this.redis.del(redisUserKey);
  }
}
