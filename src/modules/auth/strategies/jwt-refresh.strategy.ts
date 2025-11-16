import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), // ✔ matches your DTO
      ignoreExpiration: false,
      secretOrKey: config.get<string>('app.jwt.refreshSecret'), // ✔ updated path
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
