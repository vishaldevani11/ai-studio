import { Injectable, Logger } from '@nestjs/common';
import { BusinessError, ErrorCode } from '../errors/business.error';

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  stack?: string;
  additionalData?: Record<string, any>;
}

@Injectable()
export class ErrorTrackingService {
  private readonly logger = new Logger(ErrorTrackingService.name);
  private readonly errorCounts = new Map<ErrorCode, number>();
  private readonly recentErrors: Array<{
    error: BusinessError;
    context: ErrorContext;
    timestamp: Date;
  }> = [];

  async trackError(error: BusinessError, context: ErrorContext = {}): Promise<void> {
    const errorContext: ErrorContext = {
      timestamp: new Date(),
      ...context,
    };

    // Log error with context
    this.logger.error(`Business Error: ${error.code} - ${error.message}`, {
      error: error.toJSON(),
      context: errorContext,
    });

    // Update error counts
    const currentCount = this.errorCounts.get(error.code) || 0;
    this.errorCounts.set(error.code, currentCount + 1);

    // Store recent errors (keep last 100)
    this.recentErrors.push({ error, context: errorContext, timestamp: new Date() });
    if (this.recentErrors.length > 100) {
      this.recentErrors.shift();
    }

    // Send to external monitoring service (Sentry, DataDog, etc.)
    await this.sendToExternalService(error, errorContext);

    // Check for error rate alerts
    await this.checkErrorRateAlerts(error.code);
  }

  async trackSystemError(error: Error, context: ErrorContext = {}): Promise<void> {
    const businessError = new BusinessError(ErrorCode.INTERNAL_SERVER_ERROR, error.message, 500, {
      originalError: error.name,
    });

    await this.trackError(businessError, {
      ...context,
      stack: error.stack,
    });
  }

  async getErrorStats(): Promise<{
    totalErrors: number;
    errorCounts: Record<string, number>;
    recentErrors: Array<{ code: string; message: string; timestamp: Date }>;
    errorRate: number;
  }> {
    const totalErrors = Array.from(this.errorCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
    const errorCounts = Object.fromEntries(this.errorCounts);
    const recentErrors = this.recentErrors.slice(-10).map(({ error, timestamp }) => ({
      code: error.code,
      message: error.message,
      timestamp,
    }));

    // Calculate error rate (errors per minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentErrorCount = this.recentErrors.filter(
      ({ timestamp }) => timestamp > oneMinuteAgo,
    ).length;

    return {
      totalErrors,
      errorCounts,
      recentErrors,
      errorRate: recentErrorCount,
    };
  }

  async getErrorTrends(_timeWindow: number = 3600): Promise<
    Array<{
      timestamp: Date;
      errorCount: number;
      errorTypes: Record<string, number>;
    }>
  > {
    // This would typically query a time-series database
    // For now, return mock data
    return [];
  }

  private async sendToExternalService(error: BusinessError, context: ErrorContext): Promise<void> {
    try {
      // Integration with external monitoring services
      // Example: Sentry, DataDog, New Relic, etc.

      // Mock implementation
      if (process.env.NODE_ENV === 'production') {
        // await sentry.captureException(error, { extra: context });
        this.logger.debug('Error sent to external monitoring service');
      }
    } catch (serviceError) {
      this.logger.error('Failed to send error to external service:', serviceError);
    }
  }

  private async checkErrorRateAlerts(errorCode: ErrorCode): Promise<void> {
    const errorCount = this.errorCounts.get(errorCode) || 0;
    const threshold = this.getErrorThreshold(errorCode);

    if (errorCount > threshold) {
      this.logger.warn(
        `Error rate alert: ${errorCode} has occurred ${errorCount} times (threshold: ${threshold})`,
      );

      // Send alert to monitoring system
      await this.sendAlert(errorCode, errorCount, threshold);
    }
  }

  private getErrorThreshold(errorCode: ErrorCode): number {
    // Define thresholds for different error types
    const thresholds: Record<ErrorCode, number> = {
      [ErrorCode.INVALID_CREDENTIALS]: 100,
      [ErrorCode.RATE_LIMIT_EXCEEDED]: 50,
      [ErrorCode.EXTERNAL_SERVICE_ERROR]: 10,
      [ErrorCode.DATABASE_ERROR]: 5,
      [ErrorCode.INTERNAL_SERVER_ERROR]: 5,
      // Add more thresholds as needed
    } as Record<ErrorCode, number>;

    return thresholds[errorCode] || 20; // Default threshold
  }

  private async sendAlert(errorCode: ErrorCode, count: number, threshold: number): Promise<void> {
    // Send alert to monitoring system (PagerDuty, Slack, etc.)
    this.logger.warn(
      `ALERT: ${errorCode} exceeded threshold. Count: ${count}, Threshold: ${threshold}`,
    );
  }

  async clearErrorStats(): Promise<void> {
    this.errorCounts.clear();
    this.recentErrors.length = 0;
    this.logger.log('Error statistics cleared');
  }
}
