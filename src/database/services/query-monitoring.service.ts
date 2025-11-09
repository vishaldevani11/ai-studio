import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueryMonitoringService {
  private readonly logger = new Logger(QueryMonitoringService.name);
  private readonly slowQueryThreshold = 1000; // 1 second

  async logSlowQuery(query: string, duration: number, parameters?: any[]): Promise<void> {
    if (duration > this.slowQueryThreshold) {
      this.logger.warn(`Slow query detected: ${query} (${duration}ms)`, {
        query: this.sanitizeQuery(query),
        duration,
        parameters: this.sanitizeParameters(parameters),
        timestamp: new Date().toISOString(),
      });
    }
  }

  async logQueryError(query: string, error: Error, parameters?: any[]): Promise<void> {
    this.logger.error(`Query error: ${error.message}`, {
      query: this.sanitizeQuery(query),
      error: error.message,
      stack: error.stack,
      parameters: this.sanitizeParameters(parameters),
      timestamp: new Date().toISOString(),
    });
  }

  private sanitizeQuery(query: string): string {
    // Remove sensitive data from query logs
    return query
      .replace(/password\s*=\s*'[^']*'/gi, "password = '[REDACTED]'")
      .replace(/token\s*=\s*'[^']*'/gi, "token = '[REDACTED]'")
      .replace(/secret\s*=\s*'[^']*'/gi, "secret = '[REDACTED]'");
  }

  private sanitizeParameters(parameters?: any[]): any[] {
    if (!parameters) return [];

    return parameters.map(param => {
      if (typeof param === 'string') {
        // Check if parameter looks like sensitive data
        if (param.includes('password') || param.includes('token') || param.includes('secret')) {
          return '[REDACTED]';
        }
      }
      return param;
    });
  }

  async getQueryStats(): Promise<{
    totalQueries: number;
    slowQueries: number;
    averageExecutionTime: number;
    errorCount: number;
  }> {
    // This would typically connect to a metrics store
    // For now, return mock data
    return {
      totalQueries: 0,
      slowQueries: 0,
      averageExecutionTime: 0,
      errorCount: 0,
    };
  }
}
