"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    jwtService;
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    connectedUsers = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token`);
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'secretKey',
            });
            client.userId = payload.sub;
            client.userRole = payload.role;
            const userSockets = this.connectedUsers.get(payload.sub) || [];
            userSockets.push(client.id);
            this.connectedUsers.set(payload.sub, userSockets);
            client.join(`user:${payload.sub}`);
            if (payload.role === 'ADMIN') {
                client.join('admins');
            }
            else {
                client.join('talis');
            }
            this.logger.log(`Client ${client.id} connected as user ${payload.sub} (${payload.role})`);
            client.emit('connected', {
                userId: payload.sub,
                role: payload.role,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            const userSockets = this.connectedUsers.get(client.userId) || [];
            const updatedSockets = userSockets.filter((id) => id !== client.id);
            if (updatedSockets.length > 0) {
                this.connectedUsers.set(client.userId, updatedSockets);
            }
            else {
                this.connectedUsers.delete(client.userId);
            }
            this.logger.log(`Client ${client.id} (user: ${client.userId}) disconnected`);
        }
    }
    sendToUser(userId, event, data) {
        this.server.to(`user:${userId}`).emit(event, data);
        this.logger.log(`Sent ${event} to user ${userId}`);
    }
    sendToAdmins(event, data) {
        this.server.to('admins').emit(event, data);
        this.logger.log(`Sent ${event} to all admins`);
    }
    sendToTalis(event, data) {
        this.server.to('talis').emit(event, data);
        this.logger.log(`Sent ${event} to all talis`);
    }
    broadcast(event, data) {
        this.server.emit(event, data);
        this.logger.log(`Broadcast ${event} to all clients`);
    }
    notifyPolicyUpdate(userId, data) {
        this.sendToUser(userId, 'policy_update', data);
    }
    notifyRequestUpdate(userId, data) {
        this.sendToUser(userId, 'request_update', data);
    }
    notifyChatMessage(userId, data) {
        this.sendToUser(userId, 'chat_message', data);
    }
    notifyBadgeEarned(userId, data) {
        this.sendToUser(userId, 'badge_earned', data);
    }
    notifyGoalCompleted(userId, data) {
        this.sendToUser(userId, 'goal_completed', data);
    }
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
    getOnlineUserIds() {
        return Array.from(this.connectedUsers.keys());
    }
    handlePing(client) {
        return { event: 'pong', data: { timestamp: new Date().toISOString() } };
    }
    handleMarkAsRead(client, notificationId) {
        this.logger.log(`User ${client.userId} marked notification ${notificationId} as read`);
        return { success: true };
    }
    handleTyping(client, data) {
        this.sendToUser(data.receiverId, 'user_typing', {
            userId: client.userId,
            isTyping: data.isTyping,
        });
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleTyping", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                'http://localhost:3000',
                'https://b2b-insurance-frontend.onrender.com',
            ],
            credentials: true,
        },
        namespace: '/notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map