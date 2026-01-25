import { ForbiddenException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
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
    user: { id: string; email: string },
    ip: string,
    userAgent: string,
  ) {
    const isBlock = await this.redis.get(redisUserKey);
    if (isBlock) {
      throw new ForbiddenException(
        'Account temporarily locked. Try again later.',
      );
    }

    const wrongAttempts = await this.redis.get(`wrong_attempts:${user.id}`);
    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts:${user.id}`);
    } else {
      await this.redis.set(`wrong_attempts:${user.id}`, 1, 'EX', 24 * 60 * 60);
    }

    if (+wrongAttempts >= 3) {
      await this.redis.set(redisUserKey, 'true', 'EX', 24 * 60 * 60);

      await this.prismaService.log.create({
        data: {
          userId: user.id,
          ipAddress: ip,
          userAgent: userAgent,
          reason: 'Too many failed login attempts',
        },
      });

      await this.mailService.sendBlockAccountEmail(
        user.email,
        'Account Locked',
        'Your account has been locked due to too many failed login attempts.',
      );
      throw new ForbiddenException(
        'Account temporarily locked. Try again later.',
      );
    }
  }

  async blockCourseDelete(
    redisUserKey: string,
    user: { id: string; email: string },
    ip: string,
    userAgent: string,
  ) {
    const attemptsCount = await this.redis.get(redisUserKey);
    if (+attemptsCount == 2) {
      await this.prismaService.log.create({
        data: {
          userId: user.id,
          ipAddress: ip,
          userAgent: userAgent,
          reason: '3 times attempt to delete course in a day',
        },
      });

      await this.mailService.sendBlockAccountEmail(
        user.email,
        'Account Locked',
        'Your account has been locked due to 3 times attempt to delete course in a day.',
      );
      throw new ForbiddenException('You cannot delete 3 courses in a day.');
    }
    if (!attemptsCount) {
      await this.redis.set(redisUserKey, 1, 'EX', 24 * 60 * 60);
    } else {
      await this.redis.incr(redisUserKey);
    }
  }

  async deleteBlock(redisUserKey: string, userId: string) {
    await this.redis.del(redisUserKey);
    await this.redis.del(`wrong_attempts:${userId}`);
  }
}
