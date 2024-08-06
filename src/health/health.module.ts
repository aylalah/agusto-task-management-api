import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ServicesModule } from '../services';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, ServicesModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
