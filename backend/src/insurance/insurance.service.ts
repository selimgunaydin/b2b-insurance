import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
import { RequestStatus, PolicyStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';
import { SupabaseService } from '../supabase/supabase.service';
import { GoalService } from '../goal/goal.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class InsuranceService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private goalService: GoalService,
    private whatsappService: WhatsAppService,
  ) { }

  async getStats(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });

    if (!taliProfile) {
      return {
        activePolicies: 0,
        pendingOffers: 0,
        totalEarnings: 0,
      };
    }

    const taliId = taliProfile.id;

    const activePolicies = await this.prisma.policy.count({
      where: {
        insuranceRequest: {
          taliId,
        },
        status: 'ACTIVE',
      },
    });

    const pendingOffers = await this.prisma.insuranceRequest.count({
      where: {
        taliId,
        status: {
          in: [RequestStatus.PENDING_OFFER, RequestStatus.OFFER_READY],
        },
      },
    });

    // Calculate total earnings (sum of commissions)
    // Assuming commission is stored in Policy or calculated from premium
    // For now, let's sum up the 'commission' field in Policy if it exists, or calculate it.
    // Checking schema... Policy has 'commission' Decimal?
    // I'll check schema first. If not, I'll assume 0 for now or sum premiums * rate.
    // Wait, I should check schema.

    const policies = await this.prisma.policy.findMany({
      where: { insuranceRequest: { taliId } },
      select: { commission: true },
    });

    const totalEarnings = policies.reduce(
      (sum, p) => sum + (Number(p.commission) || 0),
      0,
    );

    return {
      activePolicies,
      pendingOffers,
      totalEarnings,
    };
  }

  async getRecentRequests(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });

    if (!taliProfile) return [];

    return this.prisma.insuranceRequest.findMany({
      where: { taliId: taliProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customer: true,
        policy: true,
      },
    });
  }

  async create(userId: string, dto: CreateInsuranceRequestDto) {
    // Get Tali Profile first
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });

    if (!taliProfile) {
      throw new Error('Tali profile not found');
    }

    const taliId = taliProfile.id;

    // 1. Global Check
    const globalSetting = await this.prisma.systemSetting.findUnique({
      where: { key: `insurance_type_${dto.type}_enabled` },
    });
    if (globalSetting && globalSetting.value === 'false') {
      throw new Error(
        `Bu sigorta türü (${dto.type}) şu anda sistem genelinde pasiftir.`,
      );
    }

    // 2. User Permission Check
    if (
      taliProfile.allowedInsuranceTypes &&
      taliProfile.allowedInsuranceTypes.length > 0
    ) {
      if (!taliProfile.allowedInsuranceTypes.includes(dto.type)) {
        throw new Error(
          `Bu sigorta türünü (${dto.type}) oluşturma yetkiniz bulunmamaktadır.`,
        );
      }
    }

    let customerId = dto.customerId;

    // If customerId is not provided but customerData is, try to find or create customer
    if (!customerId && dto.customerData) {
      const { tcKn, fullName, phone, email } = dto.customerData;

      // Check if customer exists for this Tali
      let customer = await this.prisma.customer.findFirst({
        where: {
          tc_kn: tcKn,
          taliId: taliId,
        },
      });

      if (!customer) {
        // Create new customer
        customer = await this.prisma.customer.create({
          data: {
            taliId,
            tc_kn: tcKn,
            fullName,
            phone,
            email,
          },
        });
      }

      customerId = customer.id;
    }

    if (!customerId) {
      throw new Error('Customer ID or Customer Data is required');
    }

    return this.prisma.insuranceRequest.create({
      data: {
        taliId,
        customerId,
        type: dto.type,
        details: dto.details || {},
        // files: dto.files || [], // Removed from schema
        status: RequestStatus.PENDING_OFFER,
      },
    });
  }

  async findAll(userId: string, role: string) {
    if (role === 'ADMIN') {
      return this.prisma.insuranceRequest.findMany({
        include: { tali: true, customer: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Tali only sees their own requests
      const taliProfile = await this.prisma.taliProfile.findUnique({
        where: { userId },
      });
      if (!taliProfile) return [];

      return this.prisma.insuranceRequest.findMany({
        where: { taliId: taliProfile.id },
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async findOne(id: string) {
    const request = await this.prisma.insuranceRequest.findUnique({
      where: { id },
      include: { tali: true, customer: true, policy: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async updateOffers(id: string, dto: UpdateOfferDto) {
    const request = await this.prisma.insuranceRequest.update({
      where: { id },
      data: {
        offers: dto.offers as any,
        status: RequestStatus.OFFER_READY,
      },
    });

    // Notify user about the offer
    await this.notificationService.createSystemNotification(
      request.taliId,
      'Teklif Hazır',
      `#${request.id.slice(0, 8)} numaralı talebiniz için teklif hazırlandı.`,
      NotificationType.SYSTEM,
    );

    return request;
  }

  async updateOffer(id: string, dto: UpdateOfferDto, userId: string) {
    const request = await this.prisma.insuranceRequest.update({
      where: { id },
      data: {
        offers: dto.offers as any,
        status: RequestStatus.OFFER_READY,
      },
    });

    // Log the action
    await this.auditService.log(userId, 'CREATE_OFFER', {
      requestId: id,
      offers: dto.offers,
    });

    // Notify user about the offer
    await this.notificationService.createSystemNotification(
      request.taliId,
      'Teklif Hazır',
      `#${request.id.slice(0, 8)} numaralı talebiniz için teklif güncellendi.`,
      NotificationType.SYSTEM,
    );

    return request;
  }

  async uploadPolicy(id: string, file: Express.Multer.File, userId: string) {
    // Sanitize filename
    const sanitizedOriginalName = file.originalname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${id}-${Date.now()}-${sanitizedOriginalName}`;

    const policyPdfUrl = await this.supabaseService.uploadFile(file, filename);

    const request = await this.prisma.insuranceRequest.update({
      where: { id },
      data: {
        policyUrl: policyPdfUrl,
        status: RequestStatus.COMPLETED,
      },
    });

    // Update or create Policy entity
    await this.prisma.policy.upsert({
      where: { insuranceRequestId: id },
      update: { pdfUrl: policyPdfUrl },
      create: {
        insuranceRequestId: id,
        pdfUrl: policyPdfUrl,
        premium: request.offers
          ? (request.offers as any[]).find(
            (o) => o.company === request.adminOfferCompany,
          )?.price || 0
          : 0, // Best effort premium
        company: request.adminOfferCompany || 'Unknown',
        policyNumber: `POL-${Date.now()}`, // Generate a temp policy number if new
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: PolicyStatus.ACTIVE,
      },
    });

    await this.auditService.log(userId, 'UPLOAD_POLICY', {
      requestId: id,
      filename,
    });

    // Notify user
    await this.notificationService.createSystemNotification(
      request.taliId,
      'Poliçe Onaylandı',
      `#${request.id.slice(0, 8)} numaralı talebiniz onaylandı ve poliçeniz oluşturuldu.`,
      NotificationType.SYSTEM,
    );

    return request;
  }

  async approveOffer(
    id: string,
    userId: string,
    selectedOffer: { company: string; price: number; description?: string },
  ) {
    const request = await this.prisma.insuranceRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== RequestStatus.OFFER_READY) {
      throw new Error('Offer is not ready for approval');
    }

    const updatedRequest = await this.prisma.insuranceRequest.update({
      where: { id },
      data: {
        status: RequestStatus.PAYMENT_PENDING,
        adminOfferCompany: selectedOffer.company,
        adminOfferPrice: selectedOffer.price,
        adminOfferDescription: selectedOffer.description,
      },
    });

    await this.auditService.log(userId, 'APPROVE_OFFER', {
      requestId: id,
      selectedOffer,
    });

    return updatedRequest;
  }

  async notifyPayment(id: string, method: string, userId: string) {
    const request = await this.prisma.insuranceRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== RequestStatus.PAYMENT_PENDING) {
      throw new Error('Request is not pending payment');
    }

    const updatedRequest = await this.prisma.insuranceRequest.update({
      where: { id },
      data: { status: RequestStatus.PAYMENT_REVIEW },
    });

    await this.auditService.log(userId, 'NOTIFY_PAYMENT', {
      requestId: id,
      method,
    });

    return updatedRequest;
  }

  async confirmPayment(id: string, userId: string, file?: Express.Multer.File) {
    const request = await this.prisma.insuranceRequest.findUnique({
      where: { id },
    });

    if (!request) throw new NotFoundException('Request not found');

    // Check if policy already exists (idempotency/repair)
    const existingPolicy = await this.prisma.policy.findUnique({
      where: { insuranceRequestId: id },
    });

    if (existingPolicy) {
      // If policy exists, ensure request is marked completed and return
      await this.prisma.insuranceRequest.update({
        where: { id },
        data: {
          status: RequestStatus.COMPLETED,
          policyUrl: existingPolicy.pdfUrl,
        },
      });
      return existingPolicy;
    }

    // Allow confirmation from PAYMENT_PENDING (legacy/direct) or PAYMENT_REVIEW (new flow)
    if (
      request.status !== RequestStatus.PAYMENT_PENDING &&
      request.status !== RequestStatus.PAYMENT_REVIEW
    ) {
      throw new Error('Request is not pending payment or review');
    }

    let policyPdfUrl = (request as any).policyUrl;
    if (file) {
      // Sanitize filename: normalize to NFD, remove diacritics, replace non-alphanumeric with _, keep extension
      const sanitizedOriginalName = file.originalname
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_');

      const filename = `${id}-${Date.now()}-${sanitizedOriginalName}`;
      policyPdfUrl = await this.supabaseService.uploadFile(file, filename);
    }

    try {
      // Transaction: Update Request -> Create Policy -> Log Audit
      const result = await this.prisma
        .$transaction(async (prisma) => {
          // 1. Update Request Status
          const updatedRequest = await prisma.insuranceRequest.update({
            where: { id },
            data: {
              status: RequestStatus.COMPLETED,
              policyUrl: policyPdfUrl, // Update if new file uploaded
            },
          });

          // 2. Create Policy
          const policy = await prisma.policy.create({
            data: {
              insuranceRequestId: id,
              policyNumber: `POL - ${Math.floor(Math.random() * 1000000)} `, // Mock Policy Number
              company: request.adminOfferCompany || 'Unknown',
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ), // 1 Year default
              premium: request.adminOfferPrice || 0,
              status: 'ACTIVE',
              pdfUrl: policyPdfUrl,
            },
          });

          return { updatedRequest, policy };
        })
        .then(async (res) => {
          await this.auditService.log(userId, 'CONFIRM_PAYMENT', {
            requestId: id,
            policyId: res.policy.id,
          });
          return res; // Return both updatedRequest and policy
        });

      // Notify user
      if (request) {
        await this.notificationService.createSystemNotification(
          request.taliId,
          'Poliçe Onaylandı',
          `#${request.id.slice(0, 8)} numaralı talebiniz onaylandı ve poliçeniz oluşturuldu.`,
          NotificationType.SYSTEM,
        );
      }

      // Track goal progress
      if (request) {
        await this.goalService.checkProgress(
          request.taliId,
          request.type,
          Number(request.adminOfferPrice || 0),
        );
      }

      // Send WhatsApp notification to customer
      if (request && result.policy) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: request.customerId || '' },
        });

        if (customer?.phone) {
          await this.whatsappService.sendPolicyNotification(
            customer.phone,
            customer.fullName || 'Değerli Müşterimiz',
            result.policy.policyNumber,
            result.policy.company,
            Number(result.policy.premium),
            result.policy.startDate,
            result.policy.endDate,
            result.policy.pdfUrl || '',
          );
        }
      }

      return result.updatedRequest;
    } catch (error) {
      console.error('Confirm Payment Error:', error);
      throw error;
    }
  }

  async getMyCustomers(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });
    if (!taliProfile) return [];

    return this.prisma.customer.findMany({
      where: { taliId: taliProfile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyPolicies(userId: string) {
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });
    if (!taliProfile) return [];

    return this.prisma.policy.findMany({
      where: {
        insuranceRequest: {
          taliId: taliProfile.id,
        },
      },
      include: {
        insuranceRequest: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllCustomers() {
    return this.prisma.customer.findMany({
      include: {
        tali: {
          include: {
            user: {
              include: {
                taliProfile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPolicies() {
    return this.prisma.policy.findMany({
      include: {
        insuranceRequest: {
          include: {
            customer: true,
            tali: {
              include: {
                user: {
                  include: {
                    taliProfile: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCancellationRequest(
    policyId: string,
    reason: string,
    userId: string,
  ) {
    const policy = await this.prisma.policy.findUnique({
      where: { id: policyId },
      include: { insuranceRequest: true },
    });

    if (!policy) throw new NotFoundException('Policy not found');

    // Verify ownership
    const taliProfile = await this.prisma.taliProfile.findUnique({
      where: { userId },
    });
    if (!taliProfile) throw new Error('Tali profile not found');

    if (policy.insuranceRequest.taliId !== taliProfile.id) {
      throw new Error('Unauthorized');
    }

    // Check if already cancelled or pending
    const existing = await this.prisma.cancellationRequest.findUnique({
      where: { policyId: policy.insuranceRequestId }, // Note: Schema links cancellation to InsuranceRequest via policyId field which is actually RequestId in schema relation... wait let me check schema.
    });

    // Schema Check:
    // model CancellationRequest {
    //   policyId   String             @unique
    //   policy     InsuranceRequest   @relation(fields: [policyId], references: [id])
    // }
    // The field is named 'policyId' but it references 'InsuranceRequest'. This is confusing naming in schema but I must follow it.
    // So 'policyId' in CancellationRequest actually holds the InsuranceRequest ID.

    if (existing) {
      throw new Error('Cancellation request already exists');
    }

    const cancellation = await this.prisma.cancellationRequest.create({
      data: {
        policyId: policy.insuranceRequestId, // Linking to InsuranceRequest ID
        reason,
        proofFiles: [], // TODO: File upload
        status: 'PENDING',
      },
    });

    await this.auditService.log(userId, 'CREATE_CANCELLATION', {
      policyId,
      reason,
    });

    return cancellation;
  }

  async getCancellationRequests(userId: string) {
    // Verify admin
    // In a real app, use RolesGuard, but double check here if needed or rely on controller
    return this.prisma.cancellationRequest.findMany({
      include: {
        policy: {
          include: {
            customer: true,
            tali: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCancellationRequest(id: string, userId: string) {
    const cancellation = await this.prisma.cancellationRequest.findUnique({
      where: { id },
      include: {
        policy: {
          include: {
            customer: true,
            tali: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!cancellation)
      throw new NotFoundException('Cancellation request not found');
    return cancellation;
  }

  async updateCancellationStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    userId: string,
  ) {
    const cancellation = await this.prisma.cancellationRequest.findUnique({
      where: { id },
      include: { policy: true },
    });

    if (!cancellation)
      throw new NotFoundException('Cancellation request not found');

    const updated = await this.prisma.cancellationRequest.update({
      where: { id },
      data: { status: status as any }, // Cast to any to avoid enum issues if imports are tricky, or import CancellationStatus
    });

    if (status === 'APPROVED') {
      // Update policy status to CANCELLED
      // Note: policyId in cancellation is actually insuranceRequestId.
      // We need to find the Policy entity linked to this insuranceRequestId.

      await this.prisma.policy.update({
        where: { insuranceRequestId: cancellation.policyId },
        data: { status: 'CANCELLED' as any }, // Force cast to avoid enum issues
      });

      // Also update InsuranceRequest status? Maybe keep it COMPLETED or add CANCELLED?
      await this.prisma.insuranceRequest.update({
        where: { id: cancellation.policyId },
        data: { status: RequestStatus.CANCELLED },
      });
    }

    // Notify user
    // Need to fetch Tali ID from cancellation -> policy (InsuranceRequest) -> Tali
    // cancellation.policy is InsuranceRequest
    const request = await this.prisma.insuranceRequest.findUnique({
      where: { id: cancellation.policyId },
    });

    if (request) {
      await this.notificationService.createSystemNotification(
        request.taliId,
        `İptal Talebi ${status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}`,
        `#${request.id.slice(0, 8)} numaralı poliçe için iptal talebiniz ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}.`,
        NotificationType.SYSTEM,
      );
    }

    await this.auditService.log(userId, 'UPDATE_CANCELLATION_STATUS', {
      cancellationId: id,
      status,
    });

    return updated;
  }
}
