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
var BadgeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeModule = void 0;
const common_1 = require("@nestjs/common");
const badge_service_1 = require("./badge.service");
const badge_controller_1 = require("./badge.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const notification_module_1 = require("../notification/notification.module");
let BadgeModule = BadgeModule_1 = class BadgeModule {
    badgeService;
    logger = new common_1.Logger(BadgeModule_1.name);
    constructor(badgeService) {
        this.badgeService = badgeService;
    }
    async onModuleInit() {
        try {
            await this.badgeService.initializeDefaultBadges();
            this.logger.log('Default badges initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize default badges:', error.message);
        }
    }
};
exports.BadgeModule = BadgeModule;
exports.BadgeModule = BadgeModule = BadgeModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notification_module_1.NotificationModule],
        controllers: [badge_controller_1.BadgeController],
        providers: [badge_service_1.BadgeService],
        exports: [badge_service_1.BadgeService],
    }),
    __metadata("design:paramtypes", [badge_service_1.BadgeService])
], BadgeModule);
//# sourceMappingURL=badge.module.js.map