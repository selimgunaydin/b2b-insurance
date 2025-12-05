import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}
export declare class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    sendToUser(userId: string, event: string, data: any): void;
    sendToAdmins(event: string, data: any): void;
    sendToTalis(event: string, data: any): void;
    broadcast(event: string, data: any): void;
    notifyPolicyUpdate(userId: string, data: {
        policyId: string;
        policyNumber: string;
        status: string;
        message: string;
    }): void;
    notifyRequestUpdate(userId: string, data: {
        requestId: string;
        status: string;
        message: string;
    }): void;
    notifyChatMessage(userId: string, data: {
        messageId: string;
        senderId: string;
        senderName: string;
        message: string;
        createdAt: string;
    }): void;
    notifyBadgeEarned(userId: string, data: {
        badgeId: string;
        badgeName: string;
        badgeDescription: string;
        points: number;
    }): void;
    notifyGoalCompleted(userId: string, data: {
        goalId: string;
        goalName: string;
        reward: number;
    }): void;
    isUserOnline(userId: string): boolean;
    getOnlineUsersCount(): number;
    getOnlineUserIds(): string[];
    handlePing(client: AuthenticatedSocket): {
        event: string;
        data: {
            timestamp: string;
        };
    };
    handleMarkAsRead(client: AuthenticatedSocket, notificationId: string): {
        success: boolean;
    };
    handleTyping(client: AuthenticatedSocket, data: {
        receiverId: string;
        isTyping: boolean;
    }): void;
}
export {};
