import { Test, TestingModule } from '@nestjs/testing';
import { I18nRedisResolverService } from './i18n-redis-resolver.service';

describe('I18nRedisResolverService', () => {
  let service: I18nRedisResolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [I18nRedisResolverService],
    }).compile();

    service = module.get<I18nRedisResolverService>(I18nRedisResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
