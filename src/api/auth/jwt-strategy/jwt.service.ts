import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { sub: id , username: email } = payload
    const user = await this.authService.getUser(id);
    if (!user) {
      throw new UnauthorizedException('Invalid User Details');
    }

    if (user?.post_status == 'suspended') {
      throw new UnauthorizedException('Your account is being reviewed, kindly reach out to us');
    }

    if (user?.closed_at) {
      throw new UnauthorizedException('Your account has been closed');
    }

    return user;
  }
}
