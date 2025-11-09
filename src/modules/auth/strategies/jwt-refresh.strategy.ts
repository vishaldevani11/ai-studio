import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from '../../../database/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.refreshSecret'), // ⭐ FIXED
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const refreshToken = req.body.refreshToken;
    const user = await this.authService.validateUserById(payload.sub);

    if (!user) throw new UnauthorizedException('Invalid user');
    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');
    if (user.refreshTokenExpires < new Date())
      throw new UnauthorizedException('Refresh token expired');

    return user;
  }
}
