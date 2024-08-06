import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioClientController } from './minio-client.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MinioService } from "nestjs-minio-module";

@Module({
  controllers: [MinioClientController],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
