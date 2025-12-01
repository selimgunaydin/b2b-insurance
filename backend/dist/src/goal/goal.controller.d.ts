import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
export declare class GoalController {
    private readonly goalService;
    constructor(goalService: GoalService);
    create(body: CreateGoalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        targetType: import("@prisma/client").$Enums.GoalTargetType;
        policyType: import("@prisma/client").$Enums.InsuranceType | null;
        targetValue: number;
        rewardType: import("@prisma/client").$Enums.RewardType;
        rewardPoints: import("@prisma/client/runtime/library").Decimal;
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
        rewardPoints: import("@prisma/client/runtime/library").Decimal;
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
            rewardPoints: import("@prisma/client/runtime/library").Decimal;
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
