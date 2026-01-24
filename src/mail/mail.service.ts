import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async sentOtp(email: string) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Nice App! Confirm your Email',
        html: `<h1>Your otp code: ${otp}</h1>`,
      });

      await this.redis.set(`otp:${email}`, otp, 'EX', 300);
    } catch (error) {
      console.log(error);
    }
  }

  async sendSecoveryUrl(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Sizning akauntingizni tiklash uchun havola',
      html: `<h1>Akauntingizni tiklash uchun havola ustiga bosing ${url}</h1>`,
    });
  }

  async sendApplyInstructorRequest(to: string, from: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `user: ${from}`,
        html: `<h1>Bu ${from} foydalanuvchi instruktor bo'lishga so'rov yubordi dasturga kirib uni tasdiqlang</h1>`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendApproveEmail(to: string, from: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `no-reply ${from}`,
        html: `<p>Admin sizning instructor bo'lish so'rovingizni qabul qildi bu havolani bosing va keraklik maydonlarni to'ldiring ${link}</p>`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
