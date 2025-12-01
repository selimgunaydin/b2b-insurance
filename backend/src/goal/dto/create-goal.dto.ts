import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { GoalTargetType, RewardType, InsuranceType } from '@prisma/client';

export class CreateGoalDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(GoalTargetType)
    targetType: GoalTargetType;

    @IsEnum(InsuranceType)
    @IsOptional()
    policyType?: InsuranceType;

    @IsNumber()
    @Min(1)
    targetValue: number;

    @IsEnum(RewardType)
    rewardType: RewardType;

    @IsNumber()
    @Min(0)
    rewardPoints: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
