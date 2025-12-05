import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const now = Date.now();

    // Sanitize body (remove sensitive data like password)
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) sanitizedBody.password = '***';
    if (sanitizedBody.creditCard) sanitizedBody.creditCard = '***';

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log success
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;

          this.logger.log(
            `${method} ${url} ${statusCode} - ${Date.now() - now}ms`,
            'HTTP',
          );
        },
        error: (error) => {
          // Log error
          this.logger.error(
            `${method} ${url} - ${error.message} - ${Date.now() - now}ms`,
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
