import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
import { NotificationService } from '../notification/notification.service';
import { SupabaseService } from '../supabase/supabase.service';
import { GoalService } from '../goal/goal.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
export declare class InsuranceService {
    private prisma;
    private auditService;
    private supabaseService;
    private notificationService;
    private goalService;
    private whatsappService;
    constructor(prisma: PrismaService, auditService: AuditService, supabaseService: SupabaseService, notificationService: NotificationService, goalService: GoalService, whatsappService: WhatsAppService);
    getStats(userId: string): Promise<{
        activePolicies: number;
        pendingOffers: number;
        totalEarnings: number;
    }>;
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
        policy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            company: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            policyUrl: string | null;
            startDate: Date;
            endDate: Date;
            insuranceRequestId: string;
            policyNumber: string;
            premium: import("@prisma/client/runtime/library").Decimal;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    })[]>;
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
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
            insuranceRequestId: string;
            policyNumber: string;
            premium: import("@prisma/client/runtime/library").Decimal;
            commissionPoints: import("@prisma/client/runtime/library").Decimal;
        } | null;
        tali: {
            id: string;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            points: import("@prisma/client/runtime/library").Decimal;
            allowedInsuranceTypes: string[];
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
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
        insuranceRequestId: string;
        policyNumber: string;
        premium: import("@prisma/client/runtime/library").Decimal;
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
        insuranceRequestId: string;
        policyNumber: string;
        premium: import("@prisma/client/runtime/library").Decimal;
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
        insuranceRequestId: string;
        policyNumber: string;
        premium: import("@prisma/client/runtime/library").Decimal;
        commissionPoints: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getAllCustomers(): Promise<({
        tali: {
            user: {
                taliProfile: {
                    id: string;
                    membershipType: import("@prisma/client").$Enums.MembershipType;
                    fullName: string;
                    tcKimlikNo: string | null;
                    phone: string | null;
                    address: string | null;
                    birthDate: Date | null;
                    hasKvkkApproval: boolean;
                    hasContractApproval: boolean;
                    points: import("@prisma/client/runtime/library").Decimal;
                    allowedInsuranceTypes: string[];
                    userId: string;
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
            membershipType: import("@prisma/client").$Enums.MembershipType;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            points: import("@prisma/client/runtime/library").Decimal;
            allowedInsuranceTypes: string[];
            userId: string;
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
                        membershipType: import("@prisma/client").$Enums.MembershipType;
                        fullName: string;
                        tcKimlikNo: string | null;
                        phone: string | null;
                        address: string | null;
                        birthDate: Date | null;
                        hasKvkkApproval: boolean;
                        hasContractApproval: boolean;
                        points: import("@prisma/client/runtime/library").Decimal;
                        allowedInsuranceTypes: string[];
                        userId: string;
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
                membershipType: import("@prisma/client").$Enums.MembershipType;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                points: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
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
        insuranceRequestId: string;
        policyNumber: string;
        premium: import("@prisma/client/runtime/library").Decimal;
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
                membershipType: import("@prisma/client").$Enums.MembershipType;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                points: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
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
                membershipType: import("@prisma/client").$Enums.MembershipType;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                points: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
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
