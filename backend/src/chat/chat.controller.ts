import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get(':requestId')
    async getMessages(@Param('requestId') requestId: string, @Request() req: any) {
        return this.chatService.getMessages(requestId, req.user.id);
    }

    @Post(':requestId')
    async sendMessage(
        @Param('requestId') requestId: string,
        @Body() body: { content: string },
        @Request() req: any
    ) {
        return this.chatService.sendMessage(requestId, req.user.id, body.content);
    }
}
