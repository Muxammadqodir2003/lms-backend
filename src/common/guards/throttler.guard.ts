import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    return (
      req.headers?.['x-forwarded-for'] ||
      req.ip ||
      req.body?.email ||
      'anonymous'
    );
  }
}
