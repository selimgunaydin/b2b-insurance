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
exports.InsuranceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const insurance_service_1 = require("./insurance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const insurance_dto_1 = require("./dto/insurance.dto");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let InsuranceController = class InsuranceController {
    insuranceService;
    constructor(insuranceService) {
        this.insuranceService = insuranceService;
    }
    async create(req, createInsuranceRequestDto) {
        return this.insuranceService.create(req.user.id, createInsuranceRequestDto);
    }
    async findAll(req) {
        return this.insuranceService.findAll(req.user.id, req.user.role);
    }
    async getStats(req) {
        return this.insuranceService.getStats(req.user.id);
    }
    async getRecent(req) {
        return this.insuranceService.getRecentRequests(req.user.id);
    }
    async getMyCustomers(req) {
        return this.insuranceService.getMyCustomers(req.user.id);
    }
    async getMyPolicies(req) {
        return this.insuranceService.getMyPolicies(req.user.id);
    }
    async getAllCustomers() {
        return this.insuranceService.getAllCustomers();
    }
    async getAllPolicies() {
        return this.insuranceService.getAllPolicies();
    }
    async findOne(id) {
        return this.insuranceService.findOne(id);
    }
    async updateOffers(id, updateOfferDto) {
        return this.insuranceService.updateOffers(id, updateOfferDto);
    }
    async uploadPolicy(id, file, req) {
        return this.insuranceService.uploadPolicy(id, file, req.user.id);
    }
    async updatePolicy(id, file, body, req) {
        const data = {
            policyNumber: body.policyNumber,
            company: body.company,
            premium: body.premium ? Number(body.premium) : undefined,
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
        };
        return this.insuranceService.updatePolicyDetails(id, data, file, req.user.id);
    }
    async approveOffer(id, body, req) {
        return this.insuranceService.approveOffer(id, req.user.id, body.selectedOffer);
    }
    async confirmPayment(id, file, req, body) {
        if (!file) {
            throw new Error('File is required');
        }
        return this.insuranceService.confirmPayment(id, req.user.id, file, body);
    }
    async notifyPayment(id, body, req) {
        return this.insuranceService.notifyPayment(id, body.method, req.user.id);
    }
    async createCancellationRequest(body, req) {
        return this.insuranceService.createCancellationRequest(body.policyId, body.reason, req.user.id);
    }
    async getCancellationRequests(req) {
        return this.insuranceService.getCancellationRequests(req.user.id);
    }
    async getCancellationRequest(id, req) {
        return this.insuranceService.getCancellationRequest(id, req.user.id);
    }
    async updateCancellationStatus(id, body, req) {
        return this.insuranceService.updateCancellationStatus(id, body.status, req.user.id);
    }
};
exports.InsuranceController = InsuranceController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, insurance_dto_1.CreateInsuranceRequestDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('my/customers'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getMyCustomers", null);
__decorate([
    (0, common_1.Get)('my/policies'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getMyPolicies", null);
__decorate([
    (0, common_1.Get)('customers/all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)('policies/all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getAllPolicies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/offers'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_dto_1.UpdateOfferDto]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateOffers", null);
__decorate([
    (0, common_1.Post)(':id/policy-upload'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "uploadPolicy", null);
__decorate([
    (0, common_1.Put)(':id/policy'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Post)(':id/approve-offer'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "approveOffer", null);
__decorate([
    (0, common_1.Post)(':id/confirm-payment'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)(':id/notify-payment'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "notifyPayment", null);
__decorate([
    (0, common_1.Post)('cancellation'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "createCancellationRequest", null);
__decorate([
    (0, common_1.Get)('cancellations/all'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getCancellationRequests", null);
__decorate([
    (0, common_1.Get)('cancellation/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getCancellationRequest", null);
__decorate([
    (0, common_1.Put)('cancellation/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateCancellationStatus", null);
exports.InsuranceController = InsuranceController = __decorate([
    (0, common_1.Controller)('insurance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [insurance_service_1.InsuranceService])
], InsuranceController);
//# sourceMappingURL=insurance.controller.js.map