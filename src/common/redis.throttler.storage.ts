import { Injectable } from '@nestjs/common';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';

@Injectable()
export class RedisThrottlerStorage extends ThrottlerStorageRedisService {
  constructor(@Inject('REDIS_CLIENT') redis: Redis) {
    super(redis);
  }
}
