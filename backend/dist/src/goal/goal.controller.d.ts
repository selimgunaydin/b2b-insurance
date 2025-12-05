import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
export declare class GoalController {
    private readonly goalService;
    constructor(goalService: GoalService);
    update(id: string, body: Partial<CreateGoalDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardPoints: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    create(body: CreateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardPoints: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardPoints: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }[]>;
    getMyGoals(req: any): Promise<({
        goal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            title: string;
            targetType: import("@prisma/client").$Enums.GoalTargetType;
            policyType: import("@prisma/client").$Enums.InsuranceType | null;
            targetValue: number;
            rewardType: import("@prisma/client").$Enums.RewardType;
            rewardPoints: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
        };
    } & {
        id: string;
        taliId: string;
        goalId: string;
        currentValue: number;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    getUserGoals(userId: string): Promise<({
        goal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            title: string;
            targetType: import("@prisma/client").$Enums.GoalTargetType;
            policyType: import("@prisma/client").$Enums.InsuranceType | null;
            targetValue: number;
            rewardType: import("@prisma/client").$Enums.RewardType;
            rewardPoints: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
        };
    } & {
        id: string;
        taliId: string;
        goalId: string;
        currentValue: number;
        isCompleted: boolean;
        completedAt: Date | null;
    })[]>;
    resetProgress(body: {
        taliId: string;
        goalId: string;
    }): Promise<{
        id: string;
        taliId: string;
        goalId: string;
        currentValue: number;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    deleteProgress(body: {
        taliId: string;
        goalId: string;
    }): Promise<{
        id: string;
        taliId: string;
        goalId: string;
        currentValue: number;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
}
