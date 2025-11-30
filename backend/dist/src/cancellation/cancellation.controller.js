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
exports.CancellationController = void 0;
const common_1 = require("@nestjs/common");
const cancellation_service_1 = require("./cancellation.service");
const cancellation_dto_1 = require("./dto/cancellation.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let CancellationController = class CancellationController {
    cancellationService;
    constructor(cancellationService) {
        this.cancellationService = cancellationService;
    }
    async create(createCancellationDto) {
        return this.cancellationService.create(createCancellationDto);
    }
    async findAll() {
        return this.cancellationService.findAll();
    }
    async updateStatus(id, dto) {
        return this.cancellationService.updateStatus(id, dto);
    }
};
exports.CancellationController = CancellationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancellation_dto_1.CreateCancellationDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancellation_dto_1.UpdateCancellationStatusDto]),
    __metadata("design:returntype", Promise)
], CancellationController.prototype, "updateStatus", null);
exports.CancellationController = CancellationController = __decorate([
    (0, common_1.Controller)('cancellation'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cancellation_service_1.CancellationService])
], CancellationController);
//# sourceMappingURL=cancellation.controller.js.map