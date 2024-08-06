import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage, ServerResponse } from 'http';
import { User, UserService } from '../api/user';
import { IoRedisService } from '../io-redis';

@Injectable()
export class SelectLanguageMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly ioRedisService: IoRedisService,
  ) {}

  async use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    // const token = req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
    // const payload = this.jwtService.decode(token)
    // const user = await this.userService.findOne(payload?.sub) as User

    // this.ioRedisService.set('kabani:user:lang', user.language ?? 'en')

    next();
  }
}
