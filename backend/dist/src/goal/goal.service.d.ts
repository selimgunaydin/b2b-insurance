import { PrismaService } from '../prisma/prisma.service';
import { GoalTargetType, RewardType, InsuranceType } from '@prisma/client';
export declare class GoalService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        description?: string;
        targetType: GoalTargetType;
        policyType?: InsuranceType;
        targetValue: number;
        rewardType: RewardType;
        rewardValue: number;
        startDate: Date;
        endDate: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardValue: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    assignGoalToAllTalis(goalId: string): Promise<void>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardValue: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }[]>;
    getTaliGoals(userId: string): Promise<({
        goal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            targetType: import("@prisma/client").$Enums.GoalTargetType;
            policyType: import("@prisma/client").$Enums.InsuranceType | null;
            targetValue: number;
            rewardType: import("@prisma/client").$Enums.RewardType;
            rewardValue: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        };
    } & {
        id: string;
        taliId: string;
        goalId: string;
        currentValue: number;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    checkProgress(taliId: string, policyType: InsuranceType, premium: number): Promise<void>;
    private grantReward;
}
