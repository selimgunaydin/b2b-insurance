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
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
        policy: {
            status: import("@prisma/client").$Enums.PolicyStatus;
            id: string;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
            id: string;
            userId: string;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            balance: import("@prisma/client/runtime/library").Decimal;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            allowedInsuranceTypes: string[];
        };
        customer: {
            id: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
        policy: {
            status: import("@prisma/client").$Enums.PolicyStatus;
            id: string;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.PolicyStatus;
        id: string;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
    } | {
        status: import("@prisma/client").$Enums.RequestStatus;
        id: string;
        taliId: string;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
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
    updatePolicyDetails(id: string, data: {
        policyNumber?: string;
        company?: string;
        premium?: number;
        startDate?: Date;
        endDate?: Date;
    }, file?: Express.Multer.File, userId?: string): Promise<{
        status: import("@prisma/client").$Enums.PolicyStatus;
        id: string;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
    }>;
    getMyCustomers(userId: string): Promise<{
        id: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string;
        tc_kn: string;
        email: string | null;
        notes: string | null;
    }[]>;
    getMyPolicies(userId: string): Promise<({
        insuranceRequest: {
            customer: {
                id: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.RequestStatus;
            id: string;
            taliId: string;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.PolicyStatus;
        id: string;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
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
                    balance: import("@prisma/client/runtime/library").Decimal;
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
            id: string;
            userId: string;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            balance: import("@prisma/client/runtime/library").Decimal;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            allowedInsuranceTypes: string[];
        };
    } & {
        id: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        phone: string;
        tc_kn: string;
        email: string | null;
        notes: string | null;
    })[]>;
    getAllPolicies(): Promise<({
        insuranceRequest: {
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
                        balance: import("@prisma/client/runtime/library").Decimal;
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
                id: string;
                userId: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                balance: import("@prisma/client/runtime/library").Decimal;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.RequestStatus;
            id: string;
            taliId: string;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.PolicyStatus;
        id: string;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    createCancellationRequest(policyId: string, reason: string, userId: string): Promise<{
        status: import("@prisma/client").$Enums.CancellationStatus;
        id: string;
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
                id: string;
                userId: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                balance: import("@prisma/client/runtime/library").Decimal;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.RequestStatus;
            id: string;
            taliId: string;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.CancellationStatus;
        id: string;
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
                id: string;
                userId: string;
                fullName: string;
                tcKimlikNo: string | null;
                phone: string | null;
                address: string | null;
                birthDate: Date | null;
                membershipType: import("@prisma/client").$Enums.MembershipType;
                balance: import("@prisma/client/runtime/library").Decimal;
                hasKvkkApproval: boolean;
                hasContractApproval: boolean;
                allowedInsuranceTypes: string[];
            };
            customer: {
                id: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.RequestStatus;
            id: string;
            taliId: string;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
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
        status: import("@prisma/client").$Enums.CancellationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
    updateCancellationStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        status: import("@prisma/client").$Enums.CancellationStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
}
