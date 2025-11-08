import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessError } from '../errors/business.error';
import { ErrorTrackingService } from '../services/error-tracking.service';

@Catch()
export class EnhancedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(EnhancedExceptionFilter.name);

  constructor(private errorTrackingService: ErrorTrackingService) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let code: string;
    let context: Record<string, any> = {};

    if (exception instanceof BusinessError) {
      status = exception.statusCode;
      message = exception.message;
      code = exception.code;
      context = exception.context || {};

      // Track business errors
      await this.errorTrackingService.trackError(exception, {
        requestId: (request as any).requestId || 'unknown',
        endpoint: request.url,
        method: request.method,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        userId: (request as any).user?.id,
      });
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      
      // Handle validation errors specifically
      if (exception instanceof BadRequestException) {
        const response = exception.getResponse();
        
        // Check if it's a formatted validation error
        if (typeof response === 'object' && response !== null && 'errors' in response) {
          code = 'VALIDATION_ERROR';
          context = {
            validationErrors: (response as any).errors,
            errorCount: (response as any).errorCount || 0,
          };
          message = (response as any).message || 'Validation failed';
        } else {
          code = 'VALIDATION_ERROR';
          // Try to extract validation details from response
          if (typeof response === 'object' && response !== null) {
            const responseObj = response as any;
            if (Array.isArray(responseObj.message)) {
              // NestJS default validation error format
              context = {
                validationErrors: responseObj.message,
                errorCount: responseObj.message.length,
              };
              message = 'Validation failed';
            }
          }
        }
      } else {
        code = 'HTTP_EXCEPTION';
      }

      // Track HTTP exceptions
      await this.errorTrackingService.trackSystemError(exception, {
        requestId: (request as any).requestId || 'unknown',
        endpoint: request.url,
        method: request.method,
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        userId: (request as any).user?.id,
      });
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';

      // Track system errors
      await this.errorTrackingService.trackSystemError(
        exception instanceof Error ? exception : new Error(String(exception)),
        {
          requestId: (request as any).requestId || 'unknown',
          endpoint: request.url,
          method: request.method,
          ipAddress: request.ip,
          userAgent: request.get('User-Agent'),
          userId: (request as any).user?.id,
        }
      );
    }

    // Build error response with proper structure
    const errorResponse: any = {
      success: false,
      error: {
        code,
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        requestId: (request as any).requestId || 'unknown',
      },
    };

    // Add validation errors to the response if present
    if (Object.keys(context).length > 0) {
      errorResponse.error.details = context;
      
      // For validation errors, also add errors array at root level for easier access
      if (code === 'VALIDATION_ERROR' && context.validationErrors) {
        errorResponse.errors = context.validationErrors;
      }
    }

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      {
        error: errorResponse,
        stack: exception instanceof Error ? exception.stack : undefined,
      }
    );

    response.status(status).json(errorResponse);
  }
}
