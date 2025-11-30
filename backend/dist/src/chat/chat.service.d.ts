import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class ChatService {
    private prisma;
    private auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    getMessages(requestId: string, userId: string): Promise<({
        sender: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            taliProfile: {
                fullName: string;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        insuranceRequestId: string;
        content: string;
        senderId: string;
        attachmentUrl: string | null;
    })[]>;
    sendMessage(userId: string, requestId: string, content: string, attachmentUrl?: string): Promise<{
        sender: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            taliProfile: {
                fullName: string;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        insuranceRequestId: string;
        content: string;
        senderId: string;
        attachmentUrl: string | null;
    }>;
}
