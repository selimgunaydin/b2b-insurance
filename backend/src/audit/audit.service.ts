import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string, action: string, details?: any, ipAddress?: string) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          details: details || {},
          ipAddress,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log', error);
      // Don't throw error to avoid blocking the main action
    }
  }
}
