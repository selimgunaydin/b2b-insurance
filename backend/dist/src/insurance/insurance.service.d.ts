import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
import { NotificationService } from '../notification/notification.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PaymentService } from '../payment/payment.service';
import { GoalService } from '../goal/goal.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { TrustScoreService } from '../user/trust-score.service';
export declare class InsuranceService {
    private prisma;
    private auditService;
    private supabaseService;
    private notificationService;
    private goalService;
    private whatsappService;
    private paymentService;
    private trustScoreService;
    constructor(prisma: PrismaService, auditService: AuditService, supabaseService: SupabaseService, notificationService: NotificationService, goalService: GoalService, whatsappService: WhatsAppService, paymentService: PaymentService, trustScoreService: TrustScoreService);
    getStats(userId: string): Promise<{
        totalEarnings: number | import("@prisma/client/runtime/library").Decimal;
        activePolicies: number;
        pendingOffers: number;
    } | null>;
    getRecentRequests(userId: string): Promise<({
        customer: {
            id: string;
            fullName: string;
            phone: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getAdminStats(): Promise<{
        totalPolicies: number;
        activePolicies: number;
        totalPremium: number | import("@prisma/client/runtime/library").Decimal;
        totalCommission: number | import("@prisma/client/runtime/library").Decimal;
        recentPolicies: ({
            insuranceRequest: {
                tali: {
                    user: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        password: string;
                        role: import("@prisma/client").$Enums.Role;
                        isApproved: boolean;
                    };
                } & {
                    userId: string;
                    id: string;
                    fullName: string;
                    tcKimlikNo: string | null;
                    phone: string | null;
                    address: string | null;
                    birthDate: Date | null;
                    membershipType: import("@prisma/client").$Enums.MembershipType;
                    points: import("@prisma/client/runtime/library").Decimal;
                    trustScore: number;
                    hasKvkkApproval: boolean;
                    hasContractApproval: boolean;
                    allowedInsuranceTypes: string[];
                };
            } & {
                type: import("@prisma/client").$Enums.InsuranceType;
                id: string;
                status: import("@prisma/client").$Enums.RequestStatus;
                taliId: string;
                customerId: string | null;
                details: import("@prisma/client/runtime/library").JsonValue;
                offers: import("@prisma/client/runtime/library").JsonValue | null;
                selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
                adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
                adminOfferCompany: string | null;
                adminOfferDescription: string | null;
                policyUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            startDate: Date;
            endDate: Date;
        })[];
    }>;
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string, role: string): Promise<({
        customer: {
            id: string;
            fullName: string;
            phone: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        tali: {
            userId: string;
            id: string;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            points: import("@prisma/client/runtime/library").Decimal;
            trustScore: number;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            allowedInsuranceTypes: string[];
        };
        customer: {
            id: string;
            fullName: string;
            phone: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
        policy: {
            id: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            startDate: Date;
            endDate: Date;
        } | null;
    } & {
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOffers(id: string, dto: UpdateOfferDto): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOffer(id: string, dto: UpdateOfferDto, userId: string): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadPolicy(id: string, file: Express.Multer.File, userId: string): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approveOffer(id: string, userId: string, selectedOffer: {
        company: string;
        price: number;
        description?: string;
    }): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    notifyPayment(id: string, method: string, userId: string): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    confirmPayment(id: string, userId: string, file?: Express.Multer.File): Promise<{
        type: import("@prisma/client").$Enums.InsuranceType;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        customerId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
    }>;
    updatePolicyDetails(id: string, data: {
        policyNumber?: string;
        company?: string;
        premium?: number;
        startDate?: Date;
        endDate?: Date;
    }, file?: Express.Multer.File, userId?: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
    }>;
    getMyCustomers(userId: string): Promise<{
        id: string;
        fullName: string;
        phone: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        tc_kn: string;
        email: string | null;
        notes: string | null;
    }[]>;
    getMyPolicies(userId: string): Promise<({
        insuranceRequest: {
            customer: {
                id: string;
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            type: import("@prisma/client").$Enums.InsuranceType;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            customerId: string | null;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    getAllCustomers(): Promise<({
        tali: {
            user: {
                taliProfile: {
                    userId: string;
                    id: string;
                    fullName: string;
                    tcKimlikNo: string | null;
                    phone: string | null;
                    address: string | null;
                    birthDate: Date | null;
                    membershipType: import("@prisma/client").$Enums.MembershipType;
                    points: import("@prisma/client/runtime/library").Decimal;
                    trustScore: number;
                    hasKvkkApproval: boolean;
                    hasContractApproval: boolean;
                    allowedInsuranceTypes: string[];
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                isApproved: boolean;
            };
        } & {
            userId: string;
            id: string;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            points: import("@prisma/client/runtime/library").Decimal;
            trustScore: number;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            allowedInsuranceTypes: string[];
        };
    } & {
        id: string;
        fullName: string;
        phone: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        tc_kn: string;
        email: string | null;
        notes: string | null;
    })[]>;
    getAllPolicies(): Promise<({
        insuranceRequest: {
            tali: {
                user: {
                    taliProfile: {
                        userId: string;
                        id: string;
                        fullName: string;
                        tcKimlikNo: string | null;
                        phone: string | null;
                        address: string | null;
                        birthDate: Date | null;
                        membershipType: import("@prisma/client").$Enums.MembershipType;
                        points: import("@prisma/client/runtime/library").Decimal;
                        trustScore: number;
                        hasKvkkApproval: boolean;
                        hasContractApproval: boolean;
                        allowedInsuranceTypes: string[];
                    } | null;
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                };
            } & {
                userId: string;
                id: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                points: import("@prisma/client/runtime/library").Decimal;
                trustScore: number;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            type: import("@prisma/client").$Enums.InsuranceType;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            customerId: string | null;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    createCancellationRequest(policyId: string, reason: string, userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
    getCancellationRequests(userId: string): Promise<({
        policy: {
            tali: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                };
            } & {
                userId: string;
                id: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                points: import("@prisma/client/runtime/library").Decimal;
                trustScore: number;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            type: import("@prisma/client").$Enums.InsuranceType;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            customerId: string | null;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    })[]>;
    getCancellationRequest(id: string, userId: string): Promise<{
        policy: {
            tali: {
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                };
            } & {
                userId: string;
                id: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                points: import("@prisma/client/runtime/library").Decimal;
                trustScore: number;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            type: import("@prisma/client").$Enums.InsuranceType;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            customerId: string | null;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
    updateCancellationStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
}
