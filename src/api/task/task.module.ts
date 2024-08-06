import { forwardRef, Module } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ServicesModule } from '../../services';
import { MailService } from '../../mail/mail.service';
import { ExportService } from 'src/services/export/export.service';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), ServicesModule],
  controllers: [TaskController],
  providers: [TaskService, UserService, MailService, MinioClientService],
  exports: [TaskService, UserService, MailService, MinioClientService],
})

export class TaskModule {}
