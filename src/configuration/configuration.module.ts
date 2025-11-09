import { Module } from '@nestjs/common';
import { FeatureFlagService } from './services/feature-flag.service';
import { SecretsService } from './services/secrets.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [FeatureFlagService, SecretsService],
  exports: [FeatureFlagService, SecretsService],
})
export class ConfigurationModule {}
