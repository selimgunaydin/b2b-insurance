import { GoalService } from './goal.service';
import { GoalTargetType, RewardType, InsuranceType } from '@prisma/client';
export declare class GoalController {
    private readonly goalService;
    constructor(goalService: GoalService);
    create(body: {
        title: string;
        description?: string;
        targetType: GoalTargetType;
        policyType?: InsuranceType;
        targetValue: number;
        rewardType: RewardType;
        rewardValue: number;
        startDate: string;
        endDate: string;
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
    getMyGoals(req: any): Promise<({
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
}
