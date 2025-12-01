import { GoalTargetType, RewardType, InsuranceType } from '@prisma/client';
export declare class CreateGoalDto {
    title: string;
    description?: string;
    targetType: GoalTargetType;
    policyType?: InsuranceType;
    targetValue: number;
    rewardType: RewardType;
    rewardPoints: number;
    startDate: string;
    endDate: string;
}
