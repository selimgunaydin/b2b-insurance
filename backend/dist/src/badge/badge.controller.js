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
exports.BadgeController = void 0;
const common_1 = require("@nestjs/common");
const badge_service_1 = require("./badge.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let BadgeController = class BadgeController {
    badgeService;
    constructor(badgeService) {
        this.badgeService = badgeService;
    }
    async getAllBadges() {
        return this.badgeService.getAllBadges();
    }
    async getLeaderboard(limit, req) {
        const currentUserId = req?.user?.id;
        return this.badgeService.getLeaderboard(limit ? parseInt(limit) : 10, currentUserId);
    }
    async getMyBadges(req) {
        return this.badgeService.getTaliBadges(req.user.id);
    }
    async getUserBadges(userId) {
        return this.badgeService.getTaliBadges(userId);
    }
    async createBadge(body) {
        return this.badgeService.createBadge(body);
    }
    async updateBadge(id, body) {
        return this.badgeService.updateBadge(id, body);
    }
    async deleteBadge(id) {
        return this.badgeService.deleteBadge(id);
    }
    async awardBadge(taliId, badgeId) {
        return this.badgeService.awardBadge(taliId, badgeId);
    }
    async checkAndAwardBadges(taliId) {
        return this.badgeService.checkAndAwardBadges(taliId);
    }
    async initializeDefaultBadges() {
        await this.badgeService.initializeDefaultBadges();
        return { message: 'Default badges initialized' };
    }
};
exports.BadgeController = BadgeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all badges' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "getAllBadges", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leaderboard with name masking for non-current user' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my badges' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "getMyBadges", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get badges for a specific user (admin only)' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "getUserBadges", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new badge (admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a badge (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "updateBadge", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a badge (admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "deleteBadge", null);
__decorate([
    (0, common_1.Post)('award/:taliId/:badgeId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Award a badge to a tali (admin only)' }),
    __param(0, (0, common_1.Param)('taliId')),
    __param(1, (0, common_1.Param)('badgeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "awardBadge", null);
__decorate([
    (0, common_1.Post)('check/:taliId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check and award eligible badges to a tali (admin only)',
    }),
    __param(0, (0, common_1.Param)('taliId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "checkAndAwardBadges", null);
__decorate([
    (0, common_1.Post)('initialize'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize default badges (admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BadgeController.prototype, "initializeDefaultBadges", null);
exports.BadgeController = BadgeController = __decorate([
    (0, swagger_1.ApiTags)('Badges'),
    (0, common_1.Controller)('badges'),
    __metadata("design:paramtypes", [badge_service_1.BadgeService])
], BadgeController);
//# sourceMappingURL=badge.controller.js.map