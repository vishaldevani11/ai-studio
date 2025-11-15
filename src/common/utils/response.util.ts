export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error: boolean;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export class ResponseUtil {
  static success<T>(data: T, message?: string, requestId?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      error: false,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  static error<T>(data: T, message: string, requestId?: string): ApiResponse {
    return {
      success: false,
      message,
      data,
      error: true,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }
}
