import { Controller, Post, Body, UseGuards } from '@nestjs/common';
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
}
