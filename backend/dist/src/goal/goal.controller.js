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
exports.GoalController = void 0;
const common_1 = require("@nestjs/common");
const goal_service_1 = require("./goal.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const create_goal_dto_1 = require("./dto/create-goal.dto");
let GoalController = class GoalController {
    goalService;
    constructor(goalService) {
        this.goalService = goalService;
    }
    async update(id, body) {
        return this.goalService.update(id, {
            ...body,
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
        });
    }
    async create(body) {
        return this.goalService.create({
            ...body,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
        });
    }
    async findAll() {
        return this.goalService.findAll();
    }
    async getMyGoals(req) {
        return this.goalService.getTaliGoals(req.user.id);
    }
    async getUserGoals(userId) {
        return this.goalService.getTaliGoals(userId);
    }
    async resetProgress(body) {
        return this.goalService.resetGoalProgress(body.taliId, body.goalId);
    }
    async deleteProgress(body) {
        return this.goalService.deleteGoalProgress(body.taliId, body.goalId);
    }
};
exports.GoalController = GoalController;
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_goal_dto_1.CreateGoalDto]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-goals'),
    (0, roles_decorator_1.Roles)(client_1.Role.TALI),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "getMyGoals", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "getUserGoals", null);
__decorate([
    (0, common_1.Put)('progress/reset'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "resetProgress", null);
__decorate([
    (0, common_1.Delete)('progress'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalController.prototype, "deleteProgress", null);
exports.GoalController = GoalController = __decorate([
    (0, common_1.Controller)('goals'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [goal_service_1.GoalService])
], GoalController);
//# sourceMappingURL=goal.controller.js.map