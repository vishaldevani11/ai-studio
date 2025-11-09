import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  // Authentication & Authorization
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',

  // User Management
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA = 'INVALID_USER_DATA',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',

  // Image Management
  IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND',
  IMAGE_GENERATION_FAILED = 'IMAGE_GENERATION_FAILED',
  IMAGE_UPLOAD_FAILED = 'IMAGE_UPLOAD_FAILED',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_SIZE_EXCEEDED = 'IMAGE_SIZE_EXCEEDED',

  // Billing & Subscriptions
  SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
  BILLING_ERROR = 'BILLING_ERROR',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // System Errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  // File Operations
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  FILE_DELETE_FAILED = 'FILE_DELETE_FAILED',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
}

export class BusinessError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    context?: Record<string, any>,
  ) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}

// Predefined business errors
export const BusinessErrors = {
  INVALID_CREDENTIALS: () =>
    new BusinessError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
      HttpStatus.UNAUTHORIZED,
    ),

  USER_NOT_FOUND: (userId?: string) =>
    new BusinessError(ErrorCode.USER_NOT_FOUND, 'User not found', HttpStatus.NOT_FOUND, { userId }),

  USER_ALREADY_EXISTS: (email: string) =>
    new BusinessError(
      ErrorCode.USER_ALREADY_EXISTS,
      'User with this email already exists',
      HttpStatus.CONFLICT,
      { email },
    ),

  IMAGE_GENERATION_FAILED: (prompt: string) =>
    new BusinessError(
      ErrorCode.IMAGE_GENERATION_FAILED,
      'Failed to generate image',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { prompt },
    ),

  RATE_LIMIT_EXCEEDED: (limit: number, window: number) =>
    new BusinessError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded. Maximum ${limit} requests per ${window} seconds`,
      HttpStatus.TOO_MANY_REQUESTS,
      { limit, window },
    ),

  QUOTA_EXCEEDED: (quota: string, limit: number) =>
    new BusinessError(
      ErrorCode.QUOTA_EXCEEDED,
      `${quota} quota exceeded. Limit: ${limit}`,
      HttpStatus.TOO_MANY_REQUESTS,
      { quota, limit },
    ),

  EXTERNAL_SERVICE_ERROR: (service: string, error: string) =>
    new BusinessError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `External service error: ${service}`,
      HttpStatus.BAD_GATEWAY,
      { service, error },
    ),
};
