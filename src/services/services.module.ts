import { HttpModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nRedisResolverService } from './i18n-redis-resolver/i18n-redis-resolver.service';
import { IoRedisModule } from '../io-redis';
import { ExportService } from './export/export.service';

@Module({
  controllers: [],
  providers: [
    I18nRedisResolverService,
    ExportService,
  ],
  imports: [HttpModule, EventEmitterModule, IoRedisModule],
  exports: [
    EventEmitterModule,
    I18nRedisResolverService,
    HttpModule,
  ],
})
export class ServicesModule {}
