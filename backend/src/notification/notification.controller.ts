import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Param,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notification')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @Roles(Role.ADMIN)
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationService.sendNotification(dto);
  }

  @Get()
  @Roles('TALI')
  getMyNotifications(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.notificationService.findAll(req.user.id);
  }

  @Post('read/:id')
  @Roles('TALI')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @Roles('TALI')
  markAllAsRead(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
