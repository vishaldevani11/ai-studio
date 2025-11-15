import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response.util'; // make sure path is correct

// ------------------------------------------------------
// 1. HttpExceptionFilter (handles known NestJS exceptions)
// ------------------------------------------------------
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const resp = exception.getResponse();

    const message = typeof resp === 'string' ? resp : (resp as any).message || exception.message;

    const requestId = (request as any).requestId || 'unknown';

    // Log error
    this.logger.error(`${request.method} ${request.url} -> ${message}`, exception.stack);

    // Unified error response
    const errorResponse = ResponseUtil.error(null, message, requestId);

    response.status(status).json(errorResponse);
  }
}

// ------------------------------------------------------
// 2. AllExceptionsFilter (handles ALL unexpected errors)
// ------------------------------------------------------
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpError = exception instanceof HttpException;

    const status = isHttpError ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpError ? exception.message : 'Internal server error';

    const requestId = (request as any).requestId || 'unknown';

    // Log error
    this.logger.error(
      `${request.method} ${request.url} -> ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Unified error response
    const errorResponse = ResponseUtil.error(null, message, requestId);

    response.status(status).json(errorResponse);
  }
}
