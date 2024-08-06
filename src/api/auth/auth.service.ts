import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user';
import { compare } from '../../utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(id: string): Promise<any> {
    return this.userService.findOne(id)
  }

  async validateUser(email: string, secret: string): Promise<any> {
    const user = await this.userService.userRepository.findOne({
      where: [{ email }],
    });
    if (user && compare(secret, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRY'),
    });
    return {
      id: user.id,
      token,
    };
  }

  async logout(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: 0,
    });
    return {
      id: user.id,
      token,
    };
  }
}
