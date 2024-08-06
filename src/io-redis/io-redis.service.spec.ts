import { Test, TestingModule } from '@nestjs/testing';
import { IoRedisService } from './io-redis.service';

describe('IoRedisService', () => {
  let service: IoRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoRedisService],
    }).compile();

    service = module.get<IoRedisService>(IoRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
