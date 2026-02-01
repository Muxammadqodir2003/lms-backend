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

  async blockVerifyOtp(ip: string, email: string, userAgent: string) {
    const isBlock = await this.redis.get(`block_verify_otp:${ip}`);
    if (isBlock) {
      return false;
    }

    const wrongAttempts = await this.redis.get(
      `wrong_attempts_verify_otp:${ip}`,
    );
    if (+wrongAttempts >= 3) {
      await this.redis.set(`block_verify_otp:${ip}`, 'true', 'EX', 30 * 60);
      await this.prismaService.log.create({
        data: {
          email,
          ipAddress: ip,
          userAgent,
          reason: 'Too many failed verify otp attempts',
        },
      });
    }

    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts_verify_otp:${ip}`);
    } else {
      await this.redis.set(`wrong_attempts_verify_otp:${ip}`, 1, 'EX', 30 * 60);
    }

    return true;
  }

  async blockSendOtp(ip: string) {
    const isBlock = await this.redis.get(`block_send_otp:${ip}`);
    if (isBlock) {
      return false;
    }

    const wrongAttempts = await this.redis.get(`wrong_attempts_send_otp:${ip}`);
    if (+wrongAttempts >= 3) {
      await this.redis.set(`block_send_otp:${ip}`, 'true', 'EX', 30 * 60);
    }

    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts_send_otp:${ip}`);
    } else {
      await this.redis.set(`wrong_attempts_send_otp:${ip}`, 1, 'EX', 30 * 60);
    }

    return true;
  }

  async blockLogin(
    redisUserKey: string,
    email: string,
    ip: string,
    userAgent: string,
  ) {
    const isBlock = await this.redis.get(redisUserKey);
    if (isBlock) {
      throw new ForbiddenException(
        'Account temporarily locked. Try again later.',
      );
    }

    const wrongAttempts = await this.redis.get(`wrong_attempts_login:${email}`);
    if (+wrongAttempts >= 3) {
      await this.redis.set(redisUserKey, 'true', 'EX', 30 * 60);

      await this.prismaService.log.create({
        data: {
          email,
          ipAddress: ip,
          userAgent: userAgent,
          reason: 'Too many failed login attempts',
        },
      });

      await this.mailService.sendBlockAccountEmail(
        email,
        'Account Locked',
        'Your account has been locked due to too many failed login attempts.',
      );
      throw new ForbiddenException(
        'Account temporarily locked. Try again later.',
      );
    }

    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts_login:${email}`);
    } else {
      await this.redis.set(`wrong_attempts_login:${email}`, 1, 'EX', 30 * 60);
    }
  }

  async blockSendUrl(ip: string) {
    const isBlock = await this.redis.get(`block_send_url:${ip}`);
    if (isBlock) {
      return false;
    }

    const wrongAttempts = await this.redis.get(`wrong_attempts_send_url:${ip}`);

    if (+wrongAttempts >= 5) {
      await this.redis.set(`block_send_url:${ip}`, 'true', 'EX', 30 * 60);
    }

    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts_send_url:${ip}`);
    } else {
      await this.redis.set(`wrong_attempts_send_url:${ip}`, 1, 'EX', 30 * 60);
    }

    return true;
  }

  async blockRecoveryAccount(ip: string) {
    const isBlock = await this.redis.get(`block_recovery_account:${ip}`);
    if (isBlock) {
      return false;
    }

    const wrongAttempts = await this.redis.get(
      `wrong_attempts_recovery_account:${ip}`,
    );

    if (+wrongAttempts >= 5) {
      await this.redis.set(
        `block_recovery_account:${ip}`,
        'true',
        'EX',
        30 * 60,
      );
    }

    if (wrongAttempts) {
      await this.redis.incr(`wrong_attempts_recovery_account:${ip}`);
    } else {
      await this.redis.set(
        `wrong_attempts_recovery_account:${ip}`,
        1,
        'EX',
        30 * 60,
      );
    }

    return true;
  }

  async blockCourseDelete(
    redisUserKey: string,
    email: string,
    ip: string,
    userAgent: string,
  ) {
    const isBlock = await this.redis.get(redisUserKey);
    if (isBlock) {
      return false;
    }

    const attemptsCount = await this.redis.get(`block_course_delete:${email}`);

    if (+attemptsCount >= 2) {
      await this.redis.set(redisUserKey, 'true', 'EX', 24 * 60 * 60);
      await this.prismaService.log.create({
        data: {
          email,
          ipAddress: ip,
          userAgent,
          reason: '3 times attempt to delete course in a day',
        },
      });

      await this.mailService.sendBlockAccountEmail(
        email,
        'Account Locked',
        'Your account has been locked due to 3 times attempt to delete course in a day.',
      );
      await this.redis.incr(redisUserKey);
      return false;
    }
    if (!attemptsCount) {
      await this.redis.set(redisUserKey, 1, 'EX', 24 * 60 * 60);
    } else {
      await this.redis.incr(redisUserKey);
    }
    return true;
  }

  async deleteBlock(redisUserKey: string, userId: string) {
    await this.redis.del(redisUserKey);
    await this.redis.del(`wrong_attempts_login:${userId}`);
  }
}
