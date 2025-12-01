import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
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
  async getMyNotifications(@Request() req: any) {
    return this.notificationService.findAll(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Post('read/:id')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  async markAllAsRead(@Request() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
