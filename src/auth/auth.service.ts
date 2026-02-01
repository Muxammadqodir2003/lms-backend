import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { TokenService } from 'src/token/token.service';
import { MailService } from 'src/mail/mail.service';
import { RedisService } from 'src/redis/redis.service';

interface SocialProfile {
  email: string;
  firstName: string;
  lastName?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mail: MailService,
    private readonly redisService: RedisService,
  ) {}

  async register(email: string, ip: string) {
    try {
      const isBlock = await this.redisService.blockSendOtp(ip);
      if (!isBlock)
        throw new UnauthorizedException(
          'Too many requests. Please try again later.',
        );

      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (existingUser)
        throw new BadRequestException('Bu email allaqachon ro‘yxatdan o‘tgan.');

      await this.mail.sentOtp(email);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verify(registerDto: RegisterDto, ip: string, userAgent: string) {
    const isBlock = await this.redisService.blockVerifyOtp(
      ip,
      registerDto.email,
      userAgent,
    );
    if (!isBlock)
      throw new UnauthorizedException('Too many failed verify otp attempts');

    const result = await this.redisService.verifyOtp(
      registerDto.email,
      registerDto.otp,
    );
    if (!result) throw new BadRequestException("Otp parol noto'g'ri");

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.saveToken(tokens.refreshToken, user.id);
    return { ...user, ...tokens };
  }

  async deleteAll() {
    return await this.prismaService.user.deleteMany({});
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user)
      throw new UnauthorizedException('Bunday foydalanuvchi topilmadi');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    const redisUserKey = `login_block:${user.id}`;
    await this.redisService.blockLogin(redisUserKey, user.email, ip, userAgent);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    const tokens = this.tokenService.generateTokens(user.id);
    await this.tokenService.saveToken(tokens.refreshToken, user.id);
    await this.redisService.deleteBlock(redisUserKey, user.id);
    return { ...user, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.tokenService.validateRefreshToken(refreshToken);
      if (!payload) throw new UnauthorizedException('Yaroqsiz token');

      const tokenDb = await this.tokenService.findToken(refreshToken);
      if (!tokenDb) throw new UnauthorizedException('Token topilmadi');

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.userId },
      });

      const tokens = this.tokenService.generateTokens(user.id);
      await this.tokenService.saveToken(tokens.refreshToken, user.id);
      return { ...user, ...tokens };
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateSocialProfile(
    profile: SocialProfile,
    source: 'google' | 'github',
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email: profile.email },
    });
    if (user) {
      const tokens = this.tokenService.generateTokens(user.id);
      await this.tokenService.saveToken(tokens.refreshToken, user.id);
      return { ...user, ...tokens };
    }

    const newUser = await this.prismaService.user.create({
      data: { email: profile.email, password: '' },
      select: { id: true, email: true, role: true },
    });

    const tokens = this.tokenService.generateTokens(newUser.id);
    await this.tokenService.saveToken(tokens.refreshToken, newUser.id);
    return { ...newUser, ...tokens };
  }

  async getRecoveryUrl(email: string, ip: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user)
      throw new UnauthorizedException('Bu email bilan foydalanuvchi topilmadi');

    const result = await this.redisService.blockSendUrl(ip);
    if (!result)
      throw new UnauthorizedException('Too many failed send url attempts');

    if (user.password === '')
      throw new UnauthorizedException(
        'Siz social profile orqali ro`yxatdan o`tgansiz!',
      );

    const token = this.tokenService.generateRecoveryToken(user.id);
    const url = `http://localhost:3000/recovery-account/${token}`;
    await this.mail.sendSecoveryUrl(email, url);
    return true;
  }

  async recoveryAccount(token: string, password: string, ip: string) {
    const result = await this.redisService.blockRecoveryAccount(ip);
    if (!result)
      throw new UnauthorizedException(
        'Too many failed recovery account attempts',
      );

    const payload = this.tokenService.validateRecoveryToken(token);
    if (!payload) throw new UnauthorizedException('Token yaroqli emas');

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user)
      throw new UnauthorizedException('Bunday foydalanuvchi topilmadi');

    if (user.password === '')
      throw new UnauthorizedException(
        'Siz social profile orqali ro`yxatdan o`tgansiz!',
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return true;
  }
}
