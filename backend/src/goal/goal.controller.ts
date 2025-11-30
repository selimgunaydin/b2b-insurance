import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  Role,
  GoalTargetType,
  RewardType,
  InsuranceType,
} from '@prisma/client';

@Controller('goals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body()
    body: {
      title: string;
      description?: string;
      targetType: GoalTargetType;
      policyType?: InsuranceType;
      targetValue: number;
      rewardType: RewardType;
      rewardPoints: number;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.goalService.create({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.goalService.findAll();
  }

  @Get('my-goals')
  @Roles(Role.TALI)
  async getMyGoals(@Request() req: any) {
    return this.goalService.getTaliGoals(req.user.id);
  }
}
