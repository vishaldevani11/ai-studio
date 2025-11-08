import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../cache/services/cache.service';
import { SecretsService } from '../../configuration/services/secrets.service';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  details?: Record<string, any>;
  error?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: HealthCheckResult[];
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  };
}

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);
  private readonly startTime = Date.now();

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
    private secretsService: SecretsService,
  ) {}

  async getSystemHealth(): Promise<SystemHealth> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      this.checkSecrets(),
      this.checkExternalServices(),
      this.checkDiskSpace(),
      this.checkMemory(),
    ]);

    const summary = this.calculateSummary(checks);
    const overallStatus = this.determineOverallStatus(summary);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '1.0.0',
      environment: this.configService.get('app.nodeEnv', 'development'),
      checks,
      summary,
    };
  }

  async getReadinessCheck(): Promise<{
    status: 'ready' | 'not_ready';
    checks: HealthCheckResult[];
  }> {
    const criticalChecks = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      this.checkSecrets(),
    ]);

    const allReady = criticalChecks.every(check => check.status === 'healthy');

    return {
      status: allReady ? 'ready' : 'not_ready',
      checks: criticalChecks,
    };
  }

  async getLivenessCheck(): Promise<{
    status: 'alive' | 'dead';
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  }> {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Consider the service alive if it's using less than 90% of memory
    const isAlive = memoryPercentage < 90;

    return {
      status: isAlive ? 'alive' : 'dead',
      uptime: Date.now() - this.startTime,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024 * 100) / 100, // MB
        total: Math.round(totalMemory / 1024 / 1024 * 100) / 100, // MB
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
    };
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Mock database check - in production, this would execute a simple query
      await new Promise(resolve => setTimeout(resolve, 10)); // Simulate DB query
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: 'healthy',
        responseTime,
        details: {
          host: this.configService.get('app.database.host'),
          database: this.configService.get('app.database.database'),
        },
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkCache(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Test cache connectivity
      const testKey = 'health_check_test';
      await this.cacheService.set(testKey, 'test_value', { ttl: 10 });
      const value = await this.cacheService.get(testKey);
      await this.cacheService.del(testKey);
      
      const responseTime = Date.now() - startTime;
      const isHealthy = value === 'test_value';
      
      return {
        service: 'cache',
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        details: {
          host: this.configService.get('app.redis.host'),
          port: this.configService.get('app.redis.port'),
        },
      };
    } catch (error) {
      return {
        service: 'cache',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkSecrets(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const healthCheck = await this.secretsService.healthCheck();
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'secrets',
        status: healthCheck.status,
        responseTime,
        details: healthCheck.secrets,
      };
    } catch (error) {
      return {
        service: 'secrets',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkExternalServices(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const services = [
        { name: 'gemini_api', url: this.configService.get('app.gemini.apiUrl') },
        { name: 'stripe_api', url: 'https://api.stripe.com' },
      ];

      const results: Record<string, boolean> = {};
      
      for (const service of services) {
        try {
          // Mock external service check
          await new Promise(resolve => setTimeout(resolve, 50));
          results[service.name] = true;
        } catch {
          results[service.name] = false;
        }
      }

      const responseTime = Date.now() - startTime;
      const allHealthy = Object.values(results).every(status => status);
      const someHealthy = Object.values(results).some(status => status);

      let status: 'healthy' | 'unhealthy' | 'degraded';
      if (allHealthy) {
        status = 'healthy';
      } else if (someHealthy) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return {
        service: 'external_services',
        status,
        responseTime,
        details: results,
      };
    } catch (error) {
      return {
        service: 'external_services',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkDiskSpace(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Mock disk space check - in production, use fs.stat or similar
      const totalSpace = 100 * 1024 * 1024 * 1024; // 100GB
      const usedSpace = 50 * 1024 * 1024 * 1024; // 50GB
      const freeSpace = totalSpace - usedSpace;
      const usagePercentage = (usedSpace / totalSpace) * 100;

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'unhealthy' | 'degraded';

      if (usagePercentage > 90) {
        status = 'unhealthy';
      } else if (usagePercentage > 80) {
        status = 'degraded';
      } else {
        status = 'healthy';
      }

      return {
        service: 'disk_space',
        status,
        responseTime,
        details: {
          total: Math.round(totalSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
          used: Math.round(usedSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
          free: Math.round(freeSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
          usagePercentage: Math.round(usagePercentage * 100) / 100,
        },
      };
    } catch (error) {
      return {
        service: 'disk_space',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkMemory(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const usagePercentage = (usedMemory / totalMemory) * 100;

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'unhealthy' | 'degraded';

      if (usagePercentage > 90) {
        status = 'unhealthy';
      } else if (usagePercentage > 80) {
        status = 'degraded';
      } else {
        status = 'healthy';
      }

      return {
        service: 'memory',
        status,
        responseTime,
        details: {
          total: Math.round(totalMemory / 1024 / 1024 * 100) / 100, // MB
          used: Math.round(usedMemory / 1024 / 1024 * 100) / 100, // MB
          usagePercentage: Math.round(usagePercentage * 100) / 100,
        },
      };
    } catch (error) {
      return {
        service: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private calculateSummary(checks: HealthCheckResult[]): {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  } {
    const summary = {
      total: checks.length,
      healthy: 0,
      unhealthy: 0,
      degraded: 0,
    };

    for (const check of checks) {
      switch (check.status) {
        case 'healthy':
          summary.healthy++;
          break;
        case 'unhealthy':
          summary.unhealthy++;
          break;
        case 'degraded':
          summary.degraded++;
          break;
      }
    }

    return summary;
  }

  private determineOverallStatus(summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
  }): 'healthy' | 'unhealthy' | 'degraded' {
    if (summary.unhealthy > 0) {
      return 'unhealthy';
    } else if (summary.degraded > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }
}
