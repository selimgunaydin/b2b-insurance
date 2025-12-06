import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, headers, ip, query, params } = request;
    const now = Date.now();
    const userAgent = headers['user-agent'] || 'Unknown';
    const clientIp = headers['x-forwarded-for'] || ip || 'Unknown';

    // Sanitize body (remove sensitive data)
    const sanitizedBody = this.sanitizeData({ ...body });
    const sanitizedQuery = Object.keys(query || {}).length > 0 ? query : null;
    const sanitizedParams = Object.keys(params || {}).length > 0 ? params : null;

    // Log incoming request
    this.logger.log(
      JSON.stringify({
        event: 'REQUEST_START',
        method,
        url,
        userId: user?.id || 'anonymous',
        userRole: user?.role || 'anonymous',
        ip: clientIp,
        userAgent: userAgent.substring(0, 100),
        query: sanitizedQuery,
        params: sanitizedParams,
        body: sanitizedBody,
        timestamp: new Date().toISOString(),
      }),
      'HTTP_REQUEST',
    );

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          // Calculate response size
          let responseSize = 'N/A';
          try {
            responseSize = JSON.stringify(responseData || {}).length + ' bytes';
          } catch {
            responseSize = 'Unable to calculate';
          }

          this.logger.log(
            JSON.stringify({
              event: 'REQUEST_SUCCESS',
              method,
              url,
              statusCode,
              duration: `${duration}ms`,
              userId: user?.id || 'anonymous',
              userRole: user?.role || 'anonymous',
              ip: clientIp,
              responseSize,
              timestamp: new Date().toISOString(),
            }),
            'HTTP_RESPONSE',
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          
          this.logger.error(
            JSON.stringify({
              event: 'REQUEST_ERROR',
              method,
              url,
              statusCode: error.status || 500,
              duration: `${duration}ms`,
              userId: user?.id || 'anonymous',
              userRole: user?.role || 'anonymous',
              ip: clientIp,
              errorMessage: error.message,
              errorName: error.name,
              timestamp: new Date().toISOString(),
            }),
            error.stack,
            'HTTP_ERROR',
          );
        },
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveKeys = [
      'password', 'token', 'accessToken', 'refreshToken',
      'creditCard', 'cardNumber', 'cvv', 'secret', 'apiKey',
      'authorization', 'cookie'
    ];
    
    const sanitized = { ...data };
    for (const key of sensitiveKeys) {
      if (sanitized[key]) sanitized[key] = '***REDACTED***';
    }
    
    // Truncate large string values
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 500) {
        sanitized[key] = sanitized[key].substring(0, 500) + '...[TRUNCATED]';
      }
    }
    
    return sanitized;
  }
}
