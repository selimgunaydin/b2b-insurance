import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    send(dto: SendNotificationDto): Promise<{
        success: boolean;
    }>;
}
