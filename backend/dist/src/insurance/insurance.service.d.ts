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
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            taliId: string;
            tc_kn: string;
            notes: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
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
                        email: string;
                        password: string;
                        role: import("@prisma/client").$Enums.Role;
                        isApproved: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    id: string;
                    userId: string;
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
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InsuranceType;
                details: import("@prisma/client/runtime/library").JsonValue;
                customerId: string | null;
                offerFileUrl: string | null;
                offers: import("@prisma/client/runtime/library").JsonValue | null;
                taliId: string;
                status: import("@prisma/client").$Enums.RequestStatus;
                selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
                adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
                adminOfferCompany: string | null;
                adminOfferDescription: string | null;
                policyUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            company: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            policyUrl: string | null;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            insuranceRequestId: string;
            policyNumber: string;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
        })[];
    }>;
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    findAll(userId: string, role: string): Promise<({
        customer: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            taliId: string;
            tc_kn: string;
            notes: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        customer: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            taliId: string;
            tc_kn: string;
            notes: string | null;
        } | null;
        policy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            company: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            policyUrl: string | null;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            insuranceRequestId: string;
            policyNumber: string;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
        } | null;
        tali: {
            id: string;
            userId: string;
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
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    updateOffers(id: string, dto: UpdateOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    updateOffer(id: string, dto: UpdateOfferDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    uploadPolicy(id: string, file: Express.Multer.File, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    approveOffer(id: string, userId: string, selectedOffer: {
        company: string;
        price: number;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    notifyPayment(id: string, method: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    confirmPayment(id: string, userId: string, file?: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offerFileUrl: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
    }>;
    updatePolicyDetails(id: string, data: {
        policyNumber?: string;
        company?: string;
        premium?: number;
        startDate?: Date;
        endDate?: Date;
    }, file?: Express.Multer.File, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
    }>;
    getMyCustomers(userId: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string;
        taliId: string;
        tc_kn: string;
        notes: string | null;
    }[]>;
    getMyPolicies(userId: string): Promise<({
        insuranceRequest: {
            customer: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                taliId: string;
                tc_kn: string;
                notes: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getAllCustomers(): Promise<({
        tali: {
            user: {
                taliProfile: {
                    id: string;
                    userId: string;
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
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                isApproved: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
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
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string;
        taliId: string;
        tc_kn: string;
        notes: string | null;
    })[]>;
    getAllPolicies(): Promise<({
        insuranceRequest: {
            customer: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                taliId: string;
                tc_kn: string;
                notes: string | null;
            } | null;
            tali: {
                user: {
                    taliProfile: {
                        id: string;
                        userId: string;
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
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                userId: string;
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
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        policyUrl: string | null;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        insuranceRequestId: string;
        policyNumber: string;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    createCancellationRequest(policyId: string, reason: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
    getCancellationRequests(userId: string): Promise<({
        policy: {
            customer: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                taliId: string;
                tc_kn: string;
                notes: string | null;
            } | null;
            tali: {
                user: {
                    id: string;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                userId: string;
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
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    })[]>;
    getCancellationRequest(id: string, userId: string): Promise<{
        policy: {
            customer: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                taliId: string;
                tc_kn: string;
                notes: string | null;
            } | null;
            tali: {
                user: {
                    id: string;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    isApproved: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                userId: string;
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
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
    updateCancellationStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
}
