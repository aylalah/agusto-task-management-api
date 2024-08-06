import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class IoRedisService {
  
  public readonly connection: Redis.Redis;

  constructor(private readonly configService: ConfigService) {
    this.connection = new Redis({
      port: this.configService.get('REDIS_PORT'),
      host: this.configService.get('REDIS_HOST'),
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: this.configService.get('REDIS_PASS'),
      db: this.configService.get('REDIS_DB'),
    });
  }

  set(
    key: Redis.KeyType,
    value: Redis.ValueType,
    expiryMode?: string | any[],
    time?: number | string,
    setMode?: number | string,
  ): Promise<Redis.Ok | null> {
    return this.connection.set(key, value, expiryMode, time, setMode);
  }

  get(key: Redis.KeyType): Promise<string | null> {
    return this.connection.get(key);
  }
  
}
