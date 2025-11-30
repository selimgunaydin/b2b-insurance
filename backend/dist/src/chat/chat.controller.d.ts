import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMessages(requestId: string, req: any): Promise<({
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
    sendMessage(req: any, requestId: string, body: {
        content: string;
        attachmentUrl?: string;
    }): Promise<{
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
