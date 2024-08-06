import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { ServicesModule } from '../../services';
import { MailService } from '../../mail/mail.service';
import { ExportService } from 'src/services/export/export.service';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ServicesModule],
  controllers: [UserController],
  providers: [UserService, ExportService, MailService, MinioClientService],
  exports: [UserService, ExportService, MailService, MinioClientService],
})
export class UserModule {}
