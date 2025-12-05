import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://b2b-insurance-frontend.onrender.com',
    ],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers: Map<string, string[]> = new Map(); // userId -> socketIds[]

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Get token from handshake
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });

      client.userId = payload.sub;
      client.userRole = payload.role;

      // Add to connected users map
      const userSockets = this.connectedUsers.get(payload.sub) || [];
      userSockets.push(client.id);
      this.connectedUsers.set(payload.sub, userSockets);

      // Join user's personal room
      client.join(`user:${payload.sub}`);

      // Join role-based room
      if (payload.role === 'ADMIN') {
        client.join('admins');
      } else {
        client.join('talis');
      }

      this.logger.log(
        `Client ${client.id} connected as user ${payload.sub} (${payload.role})`,
      );

      // Send connection success
      client.emit('connected', {
        userId: payload.sub,
        role: payload.role,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove from connected users map
      const userSockets = this.connectedUsers.get(client.userId) || [];
      const updatedSockets = userSockets.filter((id) => id !== client.id);

      if (updatedSockets.length > 0) {
        this.connectedUsers.set(client.userId, updatedSockets);
      } else {
        this.connectedUsers.delete(client.userId);
      }

      this.logger.log(
        `Client ${client.id} (user: ${client.userId}) disconnected`,
      );
    }
  }

  // === SEND METHODS ===

  // Send notification to a specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.log(`Sent ${event} to user ${userId}`);
  }

  // Send notification to all admins
  sendToAdmins(event: string, data: any) {
    this.server.to('admins').emit(event, data);
    this.logger.log(`Sent ${event} to all admins`);
  }

  // Send notification to all talis
  sendToTalis(event: string, data: any) {
    this.server.to('talis').emit(event, data);
    this.logger.log(`Sent ${event} to all talis`);
  }

  // Send notification to everyone
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Broadcast ${event} to all clients`);
  }

  // === SPECIFIC EVENTS ===

  // Notify about policy status change
  notifyPolicyUpdate(
    userId: string,
    data: {
      policyId: string;
      policyNumber: string;
      status: string;
      message: string;
    },
  ) {
    this.sendToUser(userId, 'policy_update', data);
  }

  // Notify about insurance request status change
  notifyRequestUpdate(
    userId: string,
    data: {
      requestId: string;
      status: string;
      message: string;
    },
  ) {
    this.sendToUser(userId, 'request_update', data);
  }

  // Notify about new chat message
  notifyChatMessage(
    userId: string,
    data: {
      messageId: string;
      senderId: string;
      senderName: string;
      message: string;
      createdAt: string;
    },
  ) {
    this.sendToUser(userId, 'chat_message', data);
  }

  // Notify about badge earned
  notifyBadgeEarned(
    userId: string,
    data: {
      badgeId: string;
      badgeName: string;
      badgeDescription: string;
      points: number;
    },
  ) {
    this.sendToUser(userId, 'badge_earned', data);
  }

  // Notify about goal completed
  notifyGoalCompleted(
    userId: string,
    data: {
      goalId: string;
      goalName: string;
      reward: number;
    },
  ) {
    this.sendToUser(userId, 'goal_completed', data);
  }

  // === UTILITY METHODS ===

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get all online user IDs
  getOnlineUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // === SUBSCRIBE HANDLERS ===

  // Subscribe to ping (for connection testing)
  @SubscribeMessage('ping')
  handlePing(client: AuthenticatedSocket) {
    return { event: 'pong', data: { timestamp: new Date().toISOString() } };
  }

  // Subscribe to mark notification as read
  @SubscribeMessage('markAsRead')
  handleMarkAsRead(client: AuthenticatedSocket, notificationId: string) {
    this.logger.log(
      `User ${client.userId} marked notification ${notificationId} as read`,
    );
    return { success: true };
  }

  // Subscribe to typing status
  @SubscribeMessage('typing')
  handleTyping(
    client: AuthenticatedSocket,
    data: { receiverId: string; isTyping: boolean },
  ) {
    this.sendToUser(data.receiverId, 'user_typing', {
      userId: client.userId,
      isTyping: data.isTyping,
    });
  }
}
