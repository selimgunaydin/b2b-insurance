import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendNotification(dto: SendNotificationDto) {
    if (dto.phone) {
      this.logger.log(`Sending SMS to ${dto.phone}: ${dto.message}`);
      // Mock Twilio call
    }
    if (dto.email) {
      this.logger.log(`Sending Email to ${dto.email}: ${dto.message}`);
      // Mock Email call
    }
    return { success: true };
  }
}
