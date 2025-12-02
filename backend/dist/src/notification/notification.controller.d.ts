import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    send(dto: SendNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    getMyNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: string, req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
