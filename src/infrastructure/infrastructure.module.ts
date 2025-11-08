import { Module, forwardRef } from '@nestjs/common';
import { HealthCheckService } from './services/health-check.service';
import { GracefulShutdownService } from './services/graceful-shutdown.service';
import { CacheModule } from '../cache/cache.module';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    CacheModule,
    forwardRef(() => ConfigurationModule),
  ],
  providers: [
    HealthCheckService,
    GracefulShutdownService,
  ],
  exports: [
    HealthCheckService,
    GracefulShutdownService,
  ],
})
export class InfrastructureModule {}
