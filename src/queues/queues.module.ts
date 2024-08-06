import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ServicesModule } from '../services';
import { UserModule } from '../api/user';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'nibss',
    }),
    ServicesModule,
    UserModule,
  ],
  providers: [],
  exports: [BullModule],
})
export class QueuesModule {}
