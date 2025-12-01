import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
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
import { CreateGoalDto } from './dto/create-goal.dto';

@Controller('goals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() body: Partial<CreateGoalDto>) {
    return this.goalService.update(id, {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() body: CreateGoalDto) {
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

  @Get('user/:userId')
  @Roles(Role.ADMIN)
  async getUserGoals(@Param('userId') userId: string) {
    return this.goalService.getTaliGoals(userId);
  }

  @Put('progress/reset')
  @Roles(Role.ADMIN)
  async resetProgress(@Body() body: { taliId: string; goalId: string }) {
    return this.goalService.resetGoalProgress(body.taliId, body.goalId);
  }

  @Delete('progress')
  @Roles(Role.ADMIN)
  async deleteProgress(@Body() body: { taliId: string; goalId: string }) {
    return this.goalService.deleteGoalProgress(body.taliId, body.goalId);
  }
}
