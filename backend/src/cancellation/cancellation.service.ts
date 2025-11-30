import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCancellationDto,
  UpdateCancellationStatusDto,
} from './dto/cancellation.dto';

@Injectable()
export class CancellationService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.cancellationRequest.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
