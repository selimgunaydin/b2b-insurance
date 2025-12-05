import { Injectable, BadRequestException } from '@nestjs/common';
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
    // Check if there's an existing cancellation request for this policy
    const existingRequest = await this.prisma.cancellationRequest.findUnique({
      where: { policyId: dto.policyId },
    });

    if (existingRequest) {
      if (existingRequest.status === 'REJECTED') {
        throw new BadRequestException(
          'Bu poliçe için daha önce gönderilen iptal talebi reddedilmiştir. Yeni talep oluşturamazsınız.',
        );
      }
      if (existingRequest.status === 'APPROVED') {
        throw new BadRequestException(
          'Bu poliçe için iptal talebi zaten onaylanmıştır.',
        );
      }
      if (existingRequest.status === 'PENDING') {
        throw new BadRequestException(
          'Bu poliçe için zaten bekleyen bir iptal talebiniz bulunmaktadır.',
        );
      }
    }

    // Check if the insurance request (policy) status is already cancelled
    const insuranceRequest = await this.prisma.insuranceRequest.findUnique({
      where: { id: dto.policyId },
      include: { policy: true },
    });

    if (!insuranceRequest) {
      throw new BadRequestException('Poliçe bulunamadı.');
    }

    if (insuranceRequest.status === 'CANCELLED') {
      throw new BadRequestException(
        'Bu poliçe zaten iptal edilmiştir. Yeni iptal talebi oluşturamazsınız.',
      );
    }

    // Check if the actual policy record is cancelled
    if (insuranceRequest.policy?.status === 'CANCELLED') {
      throw new BadRequestException(
        'Bu poliçe zaten iptal edilmiştir. Yeni iptal talebi oluşturamazsınız.',
      );
    }

    return this.prisma.cancellationRequest.create({
      data: {
        policyId: dto.policyId,
        reason: dto.reason,
        contactPhone: dto.contactPhone,
        proofFiles: dto.proofFiles || [],
      },
    });
  }

  async findAll() {
    return this.prisma.cancellationRequest.findMany({
      include: { 
        policy: {
          include: {
            tali: true,
            customer: true,
            policy: true,
          }
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    // First, get the tali profile for this user
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });

    if (!taliProfile) {
      return [];
    }

    // Find cancellation requests for policies that belong to this tali's insurance requests
    return this.prisma.cancellationRequest.findMany({
      where: {
        policy: {
          taliId: taliProfile.id,
        },
      },
      include: {
        policy: {
          include: {
            customer: true,
            policy: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateCancellationStatusDto) {
    const request = await this.prisma.cancellationRequest.update({
      where: { id },
      data: { 
        status: dto.status,
        adminResponse: dto.adminResponse,
      },
      include: {
        policy: {
          include: {
            policy: true,
            tali: true,
          },
        },
      },
    });

    if (request.policy && request.policy.tali) {
      const statusMessage = dto.status === 'APPROVED' 
        ? 'onaylandı' 
        : dto.status === 'REJECTED' 
        ? 'reddedildi' 
        : 'güncellendi';
      
      const policyNumber = request.policy.policy?.policyNumber || 'Beklemede';
      
      await this.notificationService.createSystemNotification(
        request.policy.tali.userId,
        'İptal Talebi Güncellendi',
        `Poliçe ${policyNumber} için iptal talebiniz ${statusMessage}.${dto.adminResponse ? ` Açıklama: ${dto.adminResponse}` : ''}`,
        'CANCELLATION',
      );
    }

    return request;
  }
}
