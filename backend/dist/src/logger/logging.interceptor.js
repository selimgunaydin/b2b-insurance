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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("./logger.service");
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user, headers, ip, query, params } = request;
        const now = Date.now();
        const userAgent = headers['user-agent'] || 'Unknown';
        const clientIp = headers['x-forwarded-for'] || ip || 'Unknown';
        const sanitizedBody = this.sanitizeData({ ...body });
        const sanitizedQuery = Object.keys(query || {}).length > 0 ? query : null;
        const sanitizedParams = Object.keys(params || {}).length > 0 ? params : null;
        this.logger.log(JSON.stringify({
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
        }), 'HTTP_REQUEST');
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseData) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                const duration = Date.now() - now;
                let responseSize = 'N/A';
                try {
                    responseSize = JSON.stringify(responseData || {}).length + ' bytes';
                }
                catch {
                    responseSize = 'Unable to calculate';
                }
                this.logger.log(JSON.stringify({
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
                }), 'HTTP_RESPONSE');
            },
            error: (error) => {
                const duration = Date.now() - now;
                this.logger.error(JSON.stringify({
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
                }), error.stack, 'HTTP_ERROR');
            },
        }));
    }
    sanitizeData(data) {
        if (!data || typeof data !== 'object')
            return data;
        const sensitiveKeys = [
            'password', 'token', 'accessToken', 'refreshToken',
            'creditCard', 'cardNumber', 'cvv', 'secret', 'apiKey',
            'authorization', 'cookie'
        ];
        const sanitized = { ...data };
        for (const key of sensitiveKeys) {
            if (sanitized[key])
                sanitized[key] = '***REDACTED***';
        }
        for (const key in sanitized) {
            if (typeof sanitized[key] === 'string' && sanitized[key].length > 500) {
                sanitized[key] = sanitized[key].substring(0, 500) + '...[TRUNCATED]';
            }
        }
        return sanitized;
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map