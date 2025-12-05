import { Logger } from '@nestjs/common';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class LoggerService extends Logger {
    private readonly notificationGateway;
    constructor(notificationGateway: NotificationGateway);
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    private broadcastLog;
}
