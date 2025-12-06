import { Injectable, Inject, LoggerService as NestLoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: WinstonLogger,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context: context || 'System' });
    this.broadcastLog('log', String(message), context);
  }

  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, { context: context || 'System', trace });
    this.broadcastLog('error', String(message), context);
  }

  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context: context || 'System' });
    this.broadcastLog('warn', String(message), context);
  }

  debug?(message: any, context?: string) {
    this.winstonLogger.debug(message, { context: context || 'System' });
    this.broadcastLog('debug', String(message), context);
  }

  verbose?(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context: context || 'System' });
    this.broadcastLog('verbose', String(message), context);
  }

  private broadcastLog(level: string, message: string, context?: string) {
    const logContext = context || 'System';
    try {
      this.notificationGateway.server?.to('admin').emit('system_log', {
        timestamp: new Date().toISOString(),
        level,
        message,
        context: logContext,
      });
    } catch (e) {
      // Socket may not be ready
    }
  }
}
