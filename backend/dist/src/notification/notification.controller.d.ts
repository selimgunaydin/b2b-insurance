import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    send(dto: SendNotificationDto): Promise<{
        success: boolean;
        count: number;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        count?: undefined;
    }>;
    getMyNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        isRead: boolean;
        type: import("@prisma/client").$Enums.NotificationType;
    }[]>;
    markAsRead(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        userId: string;
        title: string;
        isRead: boolean;
        type: import("@prisma/client").$Enums.NotificationType;
    }>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
