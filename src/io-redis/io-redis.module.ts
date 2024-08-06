import { Global, Module } from '@nestjs/common';
import { IoRedisService } from './io-redis.service';

@Global()
@Module({
  providers: [IoRedisService],
  exports: [IoRedisService],
})
export class IoRedisModule {}
