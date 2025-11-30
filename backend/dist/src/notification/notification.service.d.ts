import { SendNotificationDto } from './dto/notification.dto';
export declare class NotificationService {
    private readonly logger;
    sendNotification(dto: SendNotificationDto): Promise<{
        success: boolean;
    }>;
}
