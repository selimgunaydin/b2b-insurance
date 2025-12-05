import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CancellationService } from './cancellation.service';
import {
  CreateCancellationDto,
  UpdateCancellationStatusDto,
} from './dto/cancellation.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cancellation')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CancellationController {
  constructor(private readonly cancellationService: CancellationService) {}

  @Post()
  async create(@Body() createCancellationDto: CreateCancellationDto) {
    return this.cancellationService.create(createCancellationDto);
  }

  @Get('my')
  async getMyCancellations(@Request() req: any) {
    return this.cancellationService.findByUser(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return this.cancellationService.findAll();
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCancellationStatusDto,
  ) {
    return this.cancellationService.updateStatus(id, dto);
  }
}
