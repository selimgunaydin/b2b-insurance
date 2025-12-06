import { LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class LoggerService implements NestLoggerService {
    private readonly winstonLogger;
    private readonly notificationGateway;
    constructor(winstonLogger: WinstonLogger, notificationGateway: NotificationGateway);
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
    debug?(message: any, context?: string): void;
    verbose?(message: any, context?: string): void;
    private broadcastLog;
}
