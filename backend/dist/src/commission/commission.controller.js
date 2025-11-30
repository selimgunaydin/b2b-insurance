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
exports.CommissionController = void 0;
const common_1 = require("@nestjs/common");
const commission_service_1 = require("./commission.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let CommissionController = class CommissionController {
    commissionService;
    constructor(commissionService) {
        this.commissionService = commissionService;
    }
    async getMyRates(req) {
        const user = await this.commissionService['prisma'].user.findUnique({
            where: { id: req.user.id },
            include: { taliProfile: true },
        });
        if (!user || !user.taliProfile) {
            throw new Error('Tali profile not found');
        }
        return this.commissionService.getRatesForMembership(user.taliProfile.membershipType);
    }
    async getAllRates() {
        return this.commissionService.getAllRates();
    }
    async updateRate(id, rate) {
        return this.commissionService.updateRate(id, rate);
    }
};
exports.CommissionController = CommissionController;
__decorate([
    (0, common_1.Get)('my-rates'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getMyRates", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "getAllRates", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CommissionController.prototype, "updateRate", null);
exports.CommissionController = CommissionController = __decorate([
    (0, common_1.Controller)('commission'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [commission_service_1.CommissionService])
], CommissionController);
//# sourceMappingURL=commission.controller.js.map