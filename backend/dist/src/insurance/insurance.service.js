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
const payment_service_1 = require("../payment/payment.service");
const goal_service_1 = require("../goal/goal.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const trust_score_service_1 = require("../user/trust-score.service");
let InsuranceService = class InsuranceService {
    prisma;
    auditService;
    supabaseService;
    notificationService;
    goalService;
    whatsappService;
    paymentService;
    trustScoreService;
    constructor(prisma, auditService, supabaseService, notificationService, goalService, whatsappService, paymentService, trustScoreService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.supabaseService = supabaseService;
        this.notificationService = notificationService;
        this.goalService = goalService;
        this.whatsappService = whatsappService;
        this.paymentService = paymentService;
        this.trustScoreService = trustScoreService;
    }
    async getStats(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return null;
        const totalEarnings = await this.prisma.transactions.aggregate({
            where: {
                userId: taliProfile.userId,
                type: 'COMMISSION',
            },
            _sum: {
                points: true,
            },
        });
        const activePolicies = await this.prisma.policy.count({
            where: {
                insuranceRequest: {
                    taliId: taliProfile.id,
                },
                status: 'ACTIVE',
            },
        });
        const pendingOffers = await this.prisma.insuranceRequest.count({
            where: {
                taliId: taliProfile.id,
                status: 'OFFER_READY',
            },
        });
        return {
            totalEarnings: totalEarnings._sum.points || 0,
            activePolicies,
            pendingOffers,
        };
    }
    async getRecentRequests(userId) {
        const taliProfile = await this.prisma.taliProfile.findUnique({
            where: { userId },
        });
        if (!taliProfile)
            return [];
        return this.prisma.insuranceRequest.findMany({
            where: {
                taliId: taliProfile.id,
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                customer: true,
            },
        });
    }
    async getAdminStats() {
        const totalPolicies = await this.prisma.policy.count();
        const activePolicies = await this.prisma.policy.count({
            where: { status: 'ACTIVE' },
        });
        const totalPremiumResult = await this.prisma.policy.aggregate({
            _sum: {
                premium: true,
            },
        });
        const totalCommissionResult = await this.prisma.transactions.aggregate({
            where: { type: 'COMMISSION' },
            _sum: {
                points: true,
            },
        });
        const recentPolicies = await this.prisma.policy.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                insuranceRequest: {
                    include: {
                        tali: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            totalPolicies,
            activePolicies,
            totalPremium: totalPremiumResult._sum.premium || 0,
            totalCommission: totalCommissionResult._sum.points || 0,
            recentPolicies,
        };
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
            throw new common_1.BadRequestException(`Bu sigorta türü (${dto.type}) şu anda sistem genelinde pasiftir.`);
        }
        const trustScoreEnabledSetting = await this.prisma.systemSetting.findUnique({
            where: { key: 'trust_score_enabled' },
        });
        if (trustScoreEnabledSetting && trustScoreEnabledSetting.value === 'true') {
            const minAllSetting = await this.prisma.systemSetting.findUnique({
                where: { key: 'trust_score_min_all' },
            });
            const minAll = minAllSetting ? parseInt(minAllSetting.value) : 50;
            if (taliProfile.trustScore < minAll) {
                throw new common_1.BadRequestException(`Güven puanınız (${taliProfile.trustScore}) tüm sigorta işlemleri için gereken minimum değerin (${minAll}) altında.`);
            }
            const typeMinSetting = await this.prisma.systemSetting.findUnique({
                where: { key: `trust_score_min_${dto.type}` },
            });
            if (typeMinSetting) {
                const typeMin = parseInt(typeMinSetting.value);
                if (taliProfile.trustScore < typeMin) {
                    throw new common_1.BadRequestException(`Güven puanınız (${taliProfile.trustScore}) ${dto.type} sigortası için gereken minimum değerin (${typeMin}) altında.`);
                }
            }
        }
        if (taliProfile.allowedInsuranceTypes &&
            taliProfile.allowedInsuranceTypes.length > 0) {
            if (!taliProfile.allowedInsuranceTypes.includes(dto.type)) {
                throw new common_1.BadRequestException(`Bu sigorta türünü (${dto.type}) oluşturma yetkiniz bulunmamaktadır.`);
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
        const request = await this.prisma.insuranceRequest.create({
            data: {
                taliId,
                customerId,
                type: dto.type,
                details: dto.details || {},
                status: client_1.RequestStatus.PENDING_OFFER,
            },
        });
        await this.notificationService.notifyAdmins('Yeni Sigorta Talebi', `${taliProfile.fullName} tarafından yeni bir ${dto.type} sigorta talebi oluşturuldu.`);
        return request;
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
        const companies = new Set();
        for (const offer of dto.offers) {
            if (companies.has(offer.company)) {
                throw new Error(`Duplicate company offer: ${offer.company}`);
            }
            companies.add(offer.company);
        }
        const request = await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                offers: dto.offers,
                offerFileUrl: dto.offerFileUrl,
                status: client_1.RequestStatus.OFFER_READY,
            },
            include: { tali: true },
        });
        try {
            await this.notificationService.notifyOfferReady(request.tali.userId, `#${request.id.slice(0, 8)}`);
        }
        catch (error) {
            console.error('Failed to send notification for offer update:', error);
        }
        return request;
    }
    async updateOffer(id, dto, userId) {
        const request = await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                offers: dto.offers,
                status: client_1.RequestStatus.OFFER_READY,
            },
            include: { tali: true },
        });
        await this.auditService.log(userId, 'CREATE_OFFER', {
            requestId: id,
            offers: dto.offers,
        });
        await this.notificationService.notifyOfferReady(request.tali.userId, `#${request.id.slice(0, 8)}`);
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
            include: { tali: true },
        });
        const policy = await this.prisma.policy.upsert({
            where: { insuranceRequestId: id },
            update: { policyUrl: policyPdfUrl },
            create: {
                insuranceRequestId: id,
                policyUrl: policyPdfUrl,
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
        await this.notificationService.notifyPolicyCreated(request.tali.userId, policy.policyNumber);
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
    async confirmPayment(id, userId, file, body = {}) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
            include: { tali: true },
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
                    policyUrl: existingPolicy.policyUrl,
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
            const result = await this.prisma.$transaction(async (prisma) => {
                const updatedRequest = await prisma.insuranceRequest.update({
                    where: { id },
                    data: {
                        status: client_1.RequestStatus.COMPLETED,
                        policyUrl: policyPdfUrl,
                    },
                });
                const taliProfile = await prisma.taliProfile.findUnique({
                    where: { id: request.taliId },
                });
                let pointsEarned = 0;
                if (taliProfile) {
                    const rateKey = `commission_${taliProfile.membershipType}_${request.type}`;
                    const rateSetting = await prisma.systemSetting.findUnique({
                        where: { key: rateKey },
                    });
                    const rate = rateSetting ? parseFloat(rateSetting.value) : 0;
                    const premium = Number(request.adminOfferPrice || 0);
                    pointsEarned = (premium * rate) / 100;
                }
                const policy = await prisma.policy.upsert({
                    update: { policyUrl: policyPdfUrl },
                    where: {
                        insuranceRequestId: id,
                    },
                    create: {
                        insuranceRequestId: id,
                        policyUrl: policyPdfUrl,
                        policyNumber: body.policyNumber || 'PENDING',
                        company: body.company || request.adminOfferCompany || 'PENDING',
                        startDate: new Date(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        premium: request.adminOfferPrice || 0,
                        commissionPoints: pointsEarned,
                        status: 'ACTIVE',
                    },
                });
                if (pointsEarned > 0) {
                    await prisma.taliProfile.update({
                        where: { id: request.taliId },
                        data: { points: { increment: pointsEarned } },
                    });
                    await prisma.transactions.create({
                        data: {
                            userId: taliProfile?.userId || userId,
                            points: pointsEarned,
                            type: 'COMMISSION',
                            status: 'SUCCESS',
                        },
                    });
                }
                return { updatedRequest, policy };
            });
            try {
                await this.auditService.log(userId, 'CONFIRM_PAYMENT', {
                    requestId: id,
                    policyId: result.policy.id,
                });
            }
            catch (e) {
                console.error('Audit log failed', e);
            }
            try {
                if (request && request.tali) {
                    await this.notificationService.notifyPolicyCreated(request.tali.userId, result.policy.policyNumber);
                }
                else {
                    console.warn(`Skipping notification for request ${id}: Tali relation missing`);
                }
            }
            catch (e) {
                console.error('Notification failed', e);
            }
            try {
                if (request && result.policy) {
                    await this.goalService.checkProgress(request.taliId, request.type, Number(result.policy.premium));
                    await this.trustScoreService.updateTrustScore(request.taliId, 'POLICY_COMPLETED');
                }
            }
            catch (e) {
                console.error('Goal progress check failed', e);
            }
            try {
                if (request && result.policy) {
                    const customer = await this.prisma.customer.findUnique({
                        where: { id: request.customerId || '' },
                    });
                    const policyUrl = result.policy.policyUrl;
                    if (customer && customer.phone && policyUrl) {
                        await this.whatsappService.sendPolicyNotification(customer.phone, customer.fullName, result.policy.policyNumber, result.policy.company, Number(result.policy.premium), result.policy.startDate, result.policy.endDate, policyUrl);
                    }
                }
            }
            catch (e) {
                console.error('WhatsApp notification failed', e);
            }
            return result.updatedRequest;
        }
        catch (error) {
            console.error('Confirm Payment Error:', error);
            throw error;
        }
    }
    async updatePolicyDetails(id, data, file, userId) {
        const request = await this.prisma.insuranceRequest.findUnique({
            where: { id },
            include: { policy: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        let policyPdfUrl = request.policyUrl;
        if (file) {
            const sanitizedOriginalName = file.originalname
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${id}-${Date.now()}-${sanitizedOriginalName}`;
            policyPdfUrl = await this.supabaseService.uploadFile(file, filename);
        }
        await this.prisma.insuranceRequest.update({
            where: { id },
            data: {
                policyUrl: policyPdfUrl,
                adminOfferCompany: data.company || request.adminOfferCompany,
                adminOfferPrice: data.premium || request.adminOfferPrice,
                status: client_1.RequestStatus.COMPLETED,
            },
        });
        const policy = await this.prisma.policy.upsert({
            where: { insuranceRequestId: id },
            create: {
                insuranceRequestId: id,
                policyNumber: data.policyNumber || `POL-${Date.now()}`,
                company: data.company || request.adminOfferCompany || 'Unknown',
                premium: data.premium || request.adminOfferPrice || 0,
                startDate: data.startDate || new Date(),
                endDate: data.endDate ||
                    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                policyUrl: policyPdfUrl,
                status: 'ACTIVE',
            },
            update: {
                policyNumber: data.policyNumber,
                company: data.company,
                premium: data.premium,
                startDate: data.startDate,
                endDate: data.endDate,
                policyUrl: policyPdfUrl,
            },
        });
        if (userId) {
            await this.auditService.log(userId, 'UPDATE_POLICY', {
                requestId: id,
                updates: data,
                hasFile: !!file,
            });
        }
        return policy;
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
    async getPolicyById(id) {
        const policy = await this.prisma.policy.findUnique({
            where: { id },
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
        });
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        return policy;
    }
    async createCancellationRequest(policyId, reason, userId, contactPhone, file) {
        const policy = await this.prisma.policy.findUnique({
            where: { id: policyId },
            include: { insuranceRequest: true },
        });
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        await this.auditService.log(userId, 'CREATE_CANCELLATION', {
            policyId,
            reason,
            contactPhone,
            hasFile: !!file,
        });
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
            if (existing.status === 'REJECTED') {
                throw new common_1.BadRequestException('Bu poliçe için daha önce gönderilen iptal talebi reddedilmiştir. Yeni talep oluşturamazsınız.');
            }
            if (existing.status === 'APPROVED') {
                throw new common_1.BadRequestException('Bu poliçe için iptal talebi zaten onaylanmıştır.');
            }
            throw new common_1.BadRequestException('Bu poliçe için zaten bekleyen bir iptal talebiniz bulunmaktadır.');
        }
        if (policy.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Bu poliçe zaten iptal edilmiştir. Yeni iptal talebi oluşturamazsınız.');
        }
        const proofFiles = [];
        if (file) {
            const sanitizedOriginalName = file.originalname
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `cancel-${policyId}-${Date.now()}-${sanitizedOriginalName}`;
            const fileUrl = await this.supabaseService.uploadFile(file, filename);
            proofFiles.push(fileUrl);
        }
        const cancellation = await this.prisma.cancellationRequest.create({
            data: {
                policyId: policy.insuranceRequestId,
                reason,
                contactPhone,
                proofFiles,
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
    async updateCancellationStatus(id, status, userId, adminResponse) {
        const cancellation = await this.prisma.cancellationRequest.findUnique({
            where: { id },
            include: { policy: true },
        });
        if (!cancellation)
            throw new common_1.NotFoundException('Cancellation request not found');
        const updated = await this.prisma.cancellationRequest.update({
            where: { id },
            data: {
                status: status,
                adminResponse,
            },
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
            include: {
                tali: true,
                policy: true,
            },
        });
        if (request && request.tali) {
            const policyNumber = request.policy?.policyNumber || `#${request.id.slice(0, 8)}`;
            const statusMessage = status === 'APPROVED' ? 'onaylandı' : 'reddedildi';
            await this.notificationService.createSystemNotification(request.tali.userId, 'İptal Talebi Güncellendi', `Poliçe ${policyNumber} için iptal talebiniz ${statusMessage}.${adminResponse ? ` Açıklama: ${adminResponse}` : ''}`, client_2.NotificationType.CANCELLATION);
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
        whatsapp_service_1.WhatsAppService,
        payment_service_1.PaymentService,
        trust_score_service_1.TrustScoreService])
], InsuranceService);
//# sourceMappingURL=insurance.service.js.map