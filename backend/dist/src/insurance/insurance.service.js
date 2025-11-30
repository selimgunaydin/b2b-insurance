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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
const client_2 = require("@prisma/client");
const supabase_service_1 = require("../supabase/supabase.service");
const goal_service_1 = require("../goal/goal.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let InsuranceService = class InsuranceService {
    prisma;
    auditService;
    supabaseService;
    notificationService;
    goalService;
    whatsappService;
    constructor(prisma, auditService, supabaseService, notificationService, goalService, whatsappService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.supabaseService = supabaseService;
        this.notificationService = notificationService;
        this.goalService = goalService;
        this.whatsappService = whatsappService;
    }
    async getStats(userId) {
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
                    in: [client_1.RequestStatus.PENDING_OFFER, client_1.RequestStatus.OFFER_READY],
                },
            },
        });
        const policies = await this.prisma.policy.findMany({
            where: { insuranceRequest: { taliId } },
            select: { commission: true },
        });
        const totalEarnings = policies.reduce((sum, p) => sum + (Number(p.commission) || 0), 0);
        return {
            activePolicies,
            pendingOffers,
            totalEarnings,
        };
    }
    async getRecentRequests(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
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
    async create(userId, dto) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile) {
            throw new Error('Tali profile not found');
        }
        const taliId = taliProfile.id;
        const globalSetting = await this.prisma.systemSetting.findUnique({
            where: { key: `insurance_type_${dto.type}_enabled` },
        });
        if (globalSetting && globalSetting.value === 'false') {
            throw new Error(`Bu sigorta türü (${dto.type}) şu anda sistem genelinde pasiftir.`);
        }
        if (taliProfile.allowedInsuranceTypes &&
            taliProfile.allowedInsuranceTypes.length > 0) {
            if (!taliProfile.allowedInsuranceTypes.includes(dto.type)) {
                throw new Error(`Bu sigorta türünü (${dto.type}) oluşturma yetkiniz bulunmamaktadır.`);
            }
        }
        let customerId = dto.customerId;
        if (!customerId && dto.customerData) {
            const { tcKn, fullName, phone, email } = dto.customerData;
            let customer = await this.prisma.customer.findFirst({
                where: {
                    tc_kn: tcKn,
                    taliId: taliId,
                },
            });
            if (!customer) {
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
                status: client_1.RequestStatus.PENDING_OFFER,
            },
        });
    }
    async findAll(userId, role) {
        if (role === 'ADMIN') {
            return this.prisma.insuranceRequest.findMany({
                include: { tali: true, customer: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        else {
            const taliProfile = await this.prisma.taliProfile.findUnique({
                where: { userId },
            });
            if (!taliProfile)
                return [];
            return this.prisma.insuranceRequest.findMany({
                where: { taliId: taliProfile.id },
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            });
        }
    }
    async findOne(id) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
            include: { tali: true, customer: true, policy: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        return request;
    }
    async updateOffers(id, dto) {
        const request = await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                offers: dto.offers,
                status: client_1.RequestStatus.OFFER_READY,
            },
        });
        await this.notificationService.createSystemNotification(request.taliId, 'Teklif Hazır', `#${request.id.slice(0, 8)} numaralı talebiniz için teklif hazırlandı.`, client_2.NotificationType.SYSTEM);
        return request;
    }
    async updateOffer(id, dto, userId) {
        const request = await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                offers: dto.offers,
                status: client_1.RequestStatus.OFFER_READY,
            },
        });
        await this.auditService.log(userId, 'CREATE_OFFER', {
            requestId: id,
            offers: dto.offers,
        });
        await this.notificationService.createSystemNotification(request.taliId, 'Teklif Hazır', `#${request.id.slice(0, 8)} numaralı talebiniz için teklif güncellendi.`, client_2.NotificationType.SYSTEM);
        return request;
    }
    async uploadPolicy(id, file, userId) {
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
                status: client_1.RequestStatus.COMPLETED,
            },
        });
        await this.prisma.policy.upsert({
            where: { insuranceRequestId: id },
            update: { pdfUrl: policyPdfUrl },
            create: {
                insuranceRequestId: id,
                pdfUrl: policyPdfUrl,
                premium: request.offers
                    ? request.offers.find((o) => o.company === request.adminOfferCompany)?.price || 0
                    : 0,
                company: request.adminOfferCompany || 'Unknown',
                policyNumber: `POL-${Date.now()}`,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: client_1.PolicyStatus.ACTIVE,
            },
        });
        await this.auditService.log(userId, 'UPLOAD_POLICY', {
            requestId: id,
            filename,
        });
        await this.notificationService.createSystemNotification(request.taliId, 'Poliçe Onaylandı', `#${request.id.slice(0, 8)} numaralı talebiniz onaylandı ve poliçeniz oluşturuldu.`, client_2.NotificationType.SYSTEM);
        return request;
    }
    async approveOffer(id, userId, selectedOffer) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.status !== client_1.RequestStatus.OFFER_READY) {
            throw new Error('Offer is not ready for approval');
        }
        const updatedRequest = await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                status: client_1.RequestStatus.PAYMENT_PENDING,
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
    async notifyPayment(id, method, userId) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        if (request.status !== client_1.RequestStatus.PAYMENT_PENDING) {
            throw new Error('Request is not pending payment');
        }
        const updatedRequest = await this.prisma.insuranceRequest.update({
            where: { id },
            data: { status: client_1.RequestStatus.PAYMENT_REVIEW },
        });
        await this.auditService.log(userId, 'NOTIFY_PAYMENT', {
            requestId: id,
            method,
        });
        return updatedRequest;
    }
    async confirmPayment(id, userId, file) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        const existingPolicy = await this.prisma.policy.findUnique({
            where: { insuranceRequestId: id },
        });
        if (existingPolicy) {
            await this.prisma.insuranceRequest.update({
                where: { id },
                data: {
                    status: client_1.RequestStatus.COMPLETED,
                    policyUrl: existingPolicy.pdfUrl,
                },
            });
            return existingPolicy;
        }
        if (request.status !== client_1.RequestStatus.PAYMENT_PENDING &&
            request.status !== client_1.RequestStatus.PAYMENT_REVIEW) {
            throw new Error('Request is not pending payment or review');
        }
        let policyPdfUrl = request.policyUrl;
        if (file) {
            const sanitizedOriginalName = file.originalname
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${id}-${Date.now()}-${sanitizedOriginalName}`;
            policyPdfUrl = await this.supabaseService.uploadFile(file, filename);
        }
        try {
            const result = await this.prisma
                .$transaction(async (prisma) => {
                const updatedRequest = await prisma.insuranceRequest.update({
                    where: { id },
                    data: {
                        status: client_1.RequestStatus.COMPLETED,
                        policyUrl: policyPdfUrl,
                    },
                });
                const policy = await prisma.policy.create({
                    data: {
                        insuranceRequestId: id,
                        policyNumber: `POL - ${Math.floor(Math.random() * 1000000)} `,
                        company: request.adminOfferCompany || 'Unknown',
                        startDate: new Date(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
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
                return res;
            });
            if (request) {
                await this.notificationService.createSystemNotification(request.taliId, 'Poliçe Onaylandı', `#${request.id.slice(0, 8)} numaralı talebiniz onaylandı ve poliçeniz oluşturuldu.`, client_2.NotificationType.SYSTEM);
            }
            if (request) {
                await this.goalService.checkProgress(request.taliId, request.type, Number(request.adminOfferPrice || 0));
            }
            if (request && result.policy) {
                const customer = await this.prisma.customer.findUnique({
                    where: { id: request.customerId || '' },
                });
                if (customer?.phone) {
                    await this.whatsappService.sendPolicyNotification(customer.phone, customer.fullName || 'Değerli Müşterimiz', result.policy.policyNumber, result.policy.company, Number(result.policy.premium), result.policy.startDate, result.policy.endDate, result.policy.pdfUrl || '');
                }
            }
            return result.updatedRequest;
        }
        catch (error) {
            console.error('Confirm Payment Error:', error);
            throw error;
        }
    }
    async getMyCustomers(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
        return this.prisma.customer.findMany({
            where: { taliId: taliProfile.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyPolicies(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
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
    async createCancellationRequest(policyId, reason, userId) {
        const policy = await this.prisma.policy.findUnique({
            where: { id: policyId },
            include: { insuranceRequest: true },
        });
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            throw new Error('Tali profile not found');
        if (policy.insuranceRequest.taliId !== taliProfile.id) {
            throw new Error('Unauthorized');
        }
        const existing = await this.prisma.cancellationRequest.findUnique({
            where: { policyId: policy.insuranceRequestId },
        });
        if (existing) {
            throw new Error('Cancellation request already exists');
        }
        const cancellation = await this.prisma.cancellationRequest.create({
            data: {
                policyId: policy.insuranceRequestId,
                reason,
                proofFiles: [],
                status: 'PENDING',
            },
        });
        await this.auditService.log(userId, 'CREATE_CANCELLATION', {
            policyId,
            reason,
        });
        return cancellation;
    }
    async getCancellationRequests(userId) {
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
    async getCancellationRequest(id, userId) {
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
            throw new common_1.NotFoundException('Cancellation request not found');
        return cancellation;
    }
    async updateCancellationStatus(id, status, userId) {
        const cancellation = await this.prisma.cancellationRequest.findUnique({
            where: { id },
            include: { policy: true },
        });
        if (!cancellation)
            throw new common_1.NotFoundException('Cancellation request not found');
        const updated = await this.prisma.cancellationRequest.update({
            where: { id },
            data: { status: status },
        });
        if (status === 'APPROVED') {
            await this.prisma.policy.update({
                where: { insuranceRequestId: cancellation.policyId },
                data: { status: 'CANCELLED' },
            });
            await this.prisma.insuranceRequest.update({
                where: { id: cancellation.policyId },
                data: { status: client_1.RequestStatus.CANCELLED },
            });
        }
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id: cancellation.policyId },
        });
        if (request) {
            await this.notificationService.createSystemNotification(request.taliId, `İptal Talebi ${status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}`, `#${request.id.slice(0, 8)} numaralı poliçe için iptal talebiniz ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}.`, client_2.NotificationType.SYSTEM);
        }
        await this.auditService.log(userId, 'UPDATE_CANCELLATION_STATUS', {
            cancellationId: id,
            status,
        });
        return updated;
    }
};
exports.InsuranceService = InsuranceService;
exports.InsuranceService = InsuranceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        supabase_service_1.SupabaseService,
        notification_service_1.NotificationService,
        goal_service_1.GoalService,
        whatsapp_service_1.WhatsAppService])
], InsuranceService);
//# sourceMappingURL=insurance.service.js.map