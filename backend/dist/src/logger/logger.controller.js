"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerController = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let LoggerController = class LoggerController {
    async downloadLog(startDate, endDate, res) {
        if (!startDate) {
            throw new common_1.BadRequestException('startDate parameter is required (YYYY-MM-DD)');
        }
        const effectiveEndDate = endDate || startDate;
        const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');
        if (!fs.existsSync(logFilePath)) {
            throw new common_1.BadRequestException('Log file not found');
        }
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="logs-${startDate}-to-${effectiveEndDate}.log"`);
        const fileStream = fs.createReadStream(logFilePath);
        const readline = require('readline');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        for await (const line of rl) {
            try {
                const logEntry = JSON.parse(line);
                if (logEntry.timestamp) {
                    const logDate = logEntry.timestamp.slice(0, 10);
                    if (logDate >= startDate && logDate <= effectiveEndDate) {
                        res.write(line + '\n');
                    }
                }
            }
            catch {
                if (line.includes(startDate) || line.includes(effectiveEndDate)) {
                    res.write(line + '\n');
                }
            }
        }
        res.end();
    }
    async listLogs() {
        const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');
        if (!fs.existsSync(logFilePath)) {
            return [{
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: 'Log dosyası henüz oluşturulmadı. Sistem logları burada görüntülenecek.',
                    context: 'System'
                }];
        }
        const content = fs.readFileSync(logFilePath, 'utf-8');
        if (!content.trim()) {
            return [{
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: 'Log dosyası boş. Loglar burada görüntülenecek.',
                    context: 'System'
                }];
        }
        const lines = content.trim().split('\n');
        return lines
            .slice(-100)
            .map((line) => {
            try {
                const parsed = JSON.parse(line);
                return {
                    timestamp: parsed.timestamp || new Date().toISOString(),
                    level: parsed.level || 'info',
                    message: parsed.message || line,
                    context: parsed.context || 'System'
                };
            }
            catch {
                return {
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: line,
                    context: 'System'
                };
            }
        })
            .reverse();
    }
};
exports.LoggerController = LoggerController;
__decorate([
    (0, common_1.Get)('download'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "downloadLog", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoggerController.prototype, "listLogs", null);
exports.LoggerController = LoggerController = __decorate([
    (0, common_1.Controller)('logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
], LoggerController);
//# sourceMappingURL=logger.controller.js.map