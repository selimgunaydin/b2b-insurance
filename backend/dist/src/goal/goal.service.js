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
var GoalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GoalService = GoalService_1 = class GoalService {
    prisma;
    logger = new common_1.Logger(GoalService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const goal = await prisma.goal.create({
                    data: {
                        ...data,
                        targetValue: Math.floor(data.targetValue || 0),
                        rewardPoints: data.rewardPoints,
                    },
                });
                const talis = await prisma.taliProfile.findMany();
                if (talis.length > 0) {
                    const taliGoals = talis.map((tali) => ({
                        taliId: tali.id,
                        goalId: goal.id,
                        currentValue: 0,
                        isCompleted: false,
                    }));
                    await prisma.taliGoal.createMany({
                        data: taliGoals,
                        skipDuplicates: true,
                    });
                }
                return goal;
            });
        }
        catch (error) {
            this.logger.error('Failed to create goal:', error);
            throw error;
        }
    }
    async findAll() {
        return this.prisma.goal.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTaliGoals(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
        return this.prisma.taliGoal.findMany({
            where: { taliId: taliProfile.id },
            include: { goal: true },
            orderBy: { goal: { endDate: 'asc' } },
        });
    }
    async checkProgress(taliId, policyType, premium) {
        const activeGoals = await this.prisma.taliGoal.findMany({
            where: {
                taliId,
                isCompleted: false,
                goal: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                    OR: [
                        { policyType: null },
                        { policyType: policyType },
                    ],
                },
            },
            include: { goal: true },
        });
        for (const taliGoal of activeGoals) {
            let increment = 0;
            if (taliGoal.goal.targetType === 'COUNT') {
                increment = 1;
            }
            else if (taliGoal.goal.targetType === 'PREMIUM') {
                increment = Math.floor(premium);
            }
            const newValue = taliGoal.currentValue + increment;
            let isCompleted = false;
            if (newValue >= taliGoal.goal.targetValue) {
                isCompleted = true;
            }
            await this.prisma.taliGoal.update({
                where: { id: taliGoal.id },
                data: {
                    currentValue: newValue,
                    isCompleted,
                    completedAt: isCompleted ? new Date() : null,
                },
            });
            if (isCompleted) {
                await this.grantReward(taliId, taliGoal.goal);
            }
        }
    }
    async grantReward(taliId, goal) {
        if (goal.rewardType === client_1.RewardType.POINTS) {
            await this.prisma.taliProfile.update({
                where: { id: taliId },
                data: {
                    points: { increment: goal.rewardPoints },
                },
            });
            await this.prisma.reward.create({
                data: {
                    taliId,
                    points: goal.rewardPoints,
                    description: `Hedef Tamamlandı: ${goal.title}`,
                },
            });
            this.logger.log(`Reward granted to Tali ${taliId} for goal ${goal.title}`);
        }
    }
};
exports.GoalService = GoalService;
exports.GoalService = GoalService = GoalService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoalService);
//# sourceMappingURL=goal.service.js.map