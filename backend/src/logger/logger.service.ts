import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class LoggerService extends Logger {
  constructor(private readonly notificationGateway: NotificationGateway) {
    super();
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.broadcastLog('log', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.broadcastLog('error', message, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.broadcastLog('warn', message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.broadcastLog('debug', message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.broadcastLog('verbose', message, context);
  }

  private broadcastLog(level: string, message: string, context?: string) {
    // Determine context if not provided
    const logContext = context || 'System';

    // Broadcast to admins via socket
    // We'll add a specific event for this in NotificationGateway or just emit directly here if gateway allows
    // For now, let's assume we can emit accessing the server instance or similar,
    // but better to add a method to NotificationGateway.
    this.notificationGateway.server.to('admin').emit('system_log', {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: logContext,
    });
  }
}
