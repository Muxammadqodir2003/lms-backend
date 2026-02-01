import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Redis(config.get('REDIS_URL'), {
          tls: {
            rejectUnauthorized: false,
          },
          retryStrategy(times) {
            return Math.min(times * 50, 2000);
          },
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
