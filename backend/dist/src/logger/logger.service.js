"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const notification_gateway_1 = require("../notification/notification.gateway");
let LoggerService = class LoggerService {
    winstonLogger;
    notificationGateway;
    constructor(winstonLogger, notificationGateway) {
        this.winstonLogger = winstonLogger;
        this.notificationGateway = notificationGateway;
    }
    log(message, context) {
        this.winstonLogger.info(message, { context: context || 'System' });
        this.broadcastLog('log', String(message), context);
    }
    error(message, trace, context) {
        this.winstonLogger.error(message, { context: context || 'System', trace });
        this.broadcastLog('error', String(message), context);
    }
    warn(message, context) {
        this.winstonLogger.warn(message, { context: context || 'System' });
        this.broadcastLog('warn', String(message), context);
    }
    debug(message, context) {
        this.winstonLogger.debug(message, { context: context || 'System' });
        this.broadcastLog('debug', String(message), context);
    }
    verbose(message, context) {
        this.winstonLogger.verbose(message, { context: context || 'System' });
        this.broadcastLog('verbose', String(message), context);
    }
    broadcastLog(level, message, context) {
        const logContext = context || 'System';
        try {
            this.notificationGateway.server?.to('admin').emit('system_log', {
                timestamp: new Date().toISOString(),
                level,
                message,
                context: logContext,
            });
        }
        catch (e) {
        }
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        notification_gateway_1.NotificationGateway])
], LoggerService);
//# sourceMappingURL=logger.service.js.map