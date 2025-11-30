import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    async getMessages(requestId: string, userId: string) {
        // Verify access
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id: requestId },
            include: { tali: true },
        });

        if (!request) throw new NotFoundException('Request not found');

        // Check if user is Admin or the Tali owner
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        if (user.role !== 'ADMIN' && request.tali.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return this.prisma.message.findMany({
            where: { insuranceRequestId: requestId },
            include: { sender: { select: { id: true, email: true, role: true, taliProfile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'asc' },
        });
    }

    async sendMessage(requestId: string, userId: string, content: string) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id: requestId },
            include: { tali: true },
        });

        if (!request) throw new NotFoundException('Request not found');

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        if (user.role !== 'ADMIN' && request.tali.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const message = await this.prisma.message.create({
            data: {
                content,
                senderId: userId,
                insuranceRequestId: requestId,
            },
            include: { sender: { select: { id: true, email: true, role: true, taliProfile: { select: { fullName: true } } } } },
        });

        // Log audit? Maybe too noisy for every message. Skipping for now.

        return message;
    }
}
