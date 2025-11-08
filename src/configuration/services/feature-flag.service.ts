import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../cache/services/cache.service';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetRoles?: string[];
  conditions?: Record<string, any>;
  expiresAt?: Date;
}

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);
  private readonly cacheKey = 'feature_flags';
  private readonly cacheTtl = 300; // 5 minutes

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async isFeatureEnabled(
    featureName: string,
    userId?: string,
    userRole?: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    try {
      const flags = await this.getFeatureFlags();
      const flag = flags[featureName];

      if (!flag) {
        this.logger.warn(`Feature flag not found: ${featureName}`);
        return false;
      }

      // Check if feature is globally disabled
      if (!flag.enabled) {
        return false;
      }

      // Check expiration
      if (flag.expiresAt && flag.expiresAt < new Date()) {
        return false;
      }

      // Check target users
      if (flag.targetUsers && userId && !flag.targetUsers.includes(userId)) {
        return false;
      }

      // Check target roles
      if (flag.targetRoles && userRole && !flag.targetRoles.includes(userRole)) {
        return false;
      }

      // Check rollout percentage
      if (flag.rolloutPercentage !== undefined && userId) {
        const userHash = this.hashUserId(userId);
        const userPercentage = userHash % 100;
        
        if (userPercentage >= flag.rolloutPercentage) {
          return false;
        }
      }

      // Check custom conditions
      if (flag.conditions && context) {
        for (const [key, value] of Object.entries(flag.conditions)) {
          if (context[key] !== value) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      this.logger.error(`Error checking feature flag ${featureName}:`, error);
      return false; // Fail closed
    }
  }

  async getFeatureFlags(): Promise<Record<string, FeatureFlag>> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get<Record<string, FeatureFlag>>(this.cacheKey);
      if (cached) {
        return cached;
      }

      // Load from configuration
      const flags = this.loadFeatureFlagsFromConfig();
      
      // Cache the result
      await this.cacheService.set(this.cacheKey, flags, { ttl: this.cacheTtl });
      
      return flags;
    } catch (error) {
      this.logger.error('Error loading feature flags:', error);
      return {};
    }
  }

  async setFeatureFlag(flag: FeatureFlag): Promise<void> {
    try {
      const flags = await this.getFeatureFlags();
      flags[flag.name] = flag;
      
      // Update cache
      await this.cacheService.set(this.cacheKey, flags, { ttl: this.cacheTtl });
      
      this.logger.log(`Feature flag updated: ${flag.name}`);
    } catch (error) {
      this.logger.error(`Error setting feature flag ${flag.name}:`, error);
    }
  }

  async deleteFeatureFlag(featureName: string): Promise<void> {
    try {
      const flags = await this.getFeatureFlags();
      delete flags[featureName];
      
      // Update cache
      await this.cacheService.set(this.cacheKey, flags, { ttl: this.cacheTtl });
      
      this.logger.log(`Feature flag deleted: ${featureName}`);
    } catch (error) {
      this.logger.error(`Error deleting feature flag ${featureName}:`, error);
    }
  }

  async getFeatureFlag(featureName: string): Promise<FeatureFlag | null> {
    const flags = await this.getFeatureFlags();
    return flags[featureName] || null;
  }

  async clearFeatureFlagCache(): Promise<void> {
    await this.cacheService.del(this.cacheKey);
    this.logger.log('Feature flag cache cleared');
  }

  // Predefined feature flags
  async isAdvancedAnalyticsEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('advanced_analytics', userId, userRole);
  }

  async isBatchImageProcessingEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('batch_image_processing', userId, userRole);
  }

  async isCustomIntegrationsEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('custom_integrations', userId, userRole);
  }

  async isWhiteLabelEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('white_label', userId, userRole);
  }

  async isNewImageGenerationModelEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('new_image_generation_model', userId, userRole);
  }

  async isBetaFeaturesEnabled(userId?: string, userRole?: string): Promise<boolean> {
    return this.isFeatureEnabled('beta_features', userId, userRole);
  }

  private loadFeatureFlagsFromConfig(): Record<string, FeatureFlag> {
    // Load feature flags from environment variables or configuration
    const flags: Record<string, FeatureFlag> = {
      advanced_analytics: {
        name: 'advanced_analytics',
        enabled: this.configService.get('features.advanced_analytics', false),
        description: 'Enable advanced analytics dashboard',
        rolloutPercentage: this.configService.get('features.advanced_analytics_rollout', 0),
        targetRoles: ['admin', 'pro'],
      },
      batch_image_processing: {
        name: 'batch_image_processing',
        enabled: this.configService.get('features.batch_image_processing', false),
        description: 'Enable batch image processing',
        rolloutPercentage: this.configService.get('features.batch_processing_rollout', 0),
        targetRoles: ['pro', 'enterprise'],
      },
      custom_integrations: {
        name: 'custom_integrations',
        enabled: this.configService.get('features.custom_integrations', false),
        description: 'Enable custom API integrations',
        targetRoles: ['enterprise'],
      },
      white_label: {
        name: 'white_label',
        enabled: this.configService.get('features.white_label', false),
        description: 'Enable white-label customization',
        targetRoles: ['enterprise'],
      },
      new_image_generation_model: {
        name: 'new_image_generation_model',
        enabled: this.configService.get('features.new_image_model', false),
        description: 'Use new image generation model',
        rolloutPercentage: this.configService.get('features.new_model_rollout', 50),
      },
      beta_features: {
        name: 'beta_features',
        enabled: this.configService.get('features.beta_features', false),
        description: 'Enable beta features',
        targetRoles: ['admin'],
      },
    };

    return flags;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
