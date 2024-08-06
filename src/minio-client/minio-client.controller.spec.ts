import { Test, TestingModule } from '@nestjs/testing';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';

describe('MinioClientController', () => {
  let controller: MinioClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinioClientController],
      providers: [MinioClientService],
    }).compile();

    controller = module.get<MinioClientController>(MinioClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
