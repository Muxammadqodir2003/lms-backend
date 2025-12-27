import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStartegy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accsessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const emails = profile.emails || [];
    const email =
      emails.length > 0 ? emails[0].value : `${profile.username}@github.com`;

    const userProfile = {
      email,
      firstName: profile.displayName || profile.username,
      lastName: '',
    };

    const user = await this.authService.findOrCreateSocialProfile(
      userProfile,
      'github',
    );
    done(null, user);
  }
}
