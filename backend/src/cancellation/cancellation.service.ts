import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCancellationDto,
  UpdateCancellationStatusDto,
} from './dto/cancellation.dto';

import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CancellationService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateCancellationDto) {
    return this.prisma.cancellationRequest.create({
      data: {
        policyId: dto.policyId,
        reason: dto.reason,
        proofFiles: dto.proofFiles || [],
      },
    });
  }

  async findAll() {
    return this.prisma.cancellationRequest.findMany({
      include: { policy: true },
    });
  }

  async updateStatus(id: string, dto: UpdateCancellationStatusDto) {
    const request = await this.prisma.cancellationRequest.update({
      where: { id },
      data: { status: dto.status },
      include: {
        policy: {
          include: {
            policy: true,
            tali: true,
          },
        },
      },
    });

    if (request.policy && request.policy.policy) {
      await this.notificationService.notifyCancellationStatus(
        request.policy.tali.userId,
        dto.status,
        request.policy.policy.policyNumber,
      );
    }

    return request;
  }
}
