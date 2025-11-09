import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GracefulShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(GracefulShutdownService.name);
  private readonly shutdownTimeout = 30000; // 30 seconds
  private isShuttingDown = false;

  constructor(private configService: ConfigService) {}

  async onApplicationShutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Shutdown already in progress, ignoring signal:', signal);
      return;
    }

    this.isShuttingDown = true;
    this.logger.log(`Received shutdown signal: ${signal}`);

    try {
      await this.performGracefulShutdown();
      this.logger.log('Graceful shutdown completed successfully');
    } catch (error) {
      this.logger.error('Error during graceful shutdown:', error);
    }
  }

  private async performGracefulShutdown(): Promise<void> {
    const shutdownPromises: Promise<void>[] = [];

    // Set shutdown timeout
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Shutdown timeout exceeded'));
      }, this.shutdownTimeout);
    });

    // Add shutdown tasks
    shutdownPromises.push(
      this.closeDatabaseConnections(),
      this.closeCacheConnections(),
      this.closeQueueConnections(),
      this.finishActiveRequests(),
      this.cleanupResources(),
    );

    // Wait for all tasks to complete or timeout
    await Promise.race([Promise.allSettled(shutdownPromises), timeoutPromise]);
  }

  private async closeDatabaseConnections(): Promise<void> {
    try {
      this.logger.log('Closing database connections...');

      // In a real implementation, you would close TypeORM connections
      // await this.dataSource.destroy();

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.logger.log('Database connections closed');
    } catch (error) {
      this.logger.error('Error closing database connections:', error);
    }
  }

  private async closeCacheConnections(): Promise<void> {
    try {
      this.logger.log('Closing cache connections...');

      // In a real implementation, you would close Redis connections
      // await this.redisClient.quit();

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.logger.log('Cache connections closed');
    } catch (error) {
      this.logger.error('Error closing cache connections:', error);
    }
  }

  private async closeQueueConnections(): Promise<void> {
    try {
      this.logger.log('Closing queue connections...');

      // In a real implementation, you would close Bull queue connections
      // await this.queue.close();

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.logger.log('Queue connections closed');
    } catch (error) {
      this.logger.error('Error closing queue connections:', error);
    }
  }

  private async finishActiveRequests(): Promise<void> {
    try {
      this.logger.log('Waiting for active requests to complete...');

      // In a real implementation, you would track active requests
      // and wait for them to complete

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.logger.log('Active requests completed');
    } catch (error) {
      this.logger.error('Error finishing active requests:', error);
    }
  }

  private async cleanupResources(): Promise<void> {
    try {
      this.logger.log('Cleaning up resources...');

      // Clean up temporary files
      // await this.cleanupTempFiles();

      // Clean up logs
      // await this.cleanupLogs();

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.logger.log('Resources cleaned up');
    } catch (error) {
      this.logger.error('Error cleaning up resources:', error);
    }
  }

  // Method to check if the application is shutting down
  isApplicationShuttingDown(): boolean {
    return this.isShuttingDown;
  }

  // Method to initiate graceful shutdown programmatically
  async initiateShutdown(reason: string = 'Manual shutdown'): Promise<void> {
    this.logger.log(`Initiating graceful shutdown: ${reason}`);
    await this.onApplicationShutdown('SIGTERM');
  }
}
