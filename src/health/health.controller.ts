import { Controller, Get, HttpException } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
// import { services } from '../app.config';
import { success } from '../utils';

@Controller('health')
export class HealthController {
  // services = services();

  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get('/')
  @HealthCheck()
  async check() {
    return success(
      await this.health.check([
        () => this.database.pingCheck('database'),
        () => this.memory.checkHeap('memory-heap', 150 * 1024 * 1024),
        // () => this.memory.checkRSS('memory-rss', 150 * 1024 * 1024),
        // () => this.disk.checkStorage('disk-storage'),
        // ...Object.keys(this.services).map((serviceName) => {
        //     return () => this.http.pingCheck(serviceName, `${this.services[serviceName].baseUrl}/health`)
        // })
      ]),
      'Health Checks',
      'Health checks for app parts',
    );
  }
}
