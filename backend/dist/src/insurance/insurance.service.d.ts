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
            fullName: string;
            phone: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            tc_kn: string;
            notes: string | null;
        } | null;
        policy: {
            company: string;
            id: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            createdAt: Date;
            updatedAt: Date;
            insuranceRequestId: string;
            policyNumber: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
        } | null;
    } & {
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
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
            email: string | null;
            tc_kn: string;
            notes: string | null;
        } | null;
    } & {
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
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
            fullName: string;
            phone: string;
            taliId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            tc_kn: string;
            notes: string | null;
        } | null;
        policy: {
            company: string;
            id: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            createdAt: Date;
            updatedAt: Date;
            insuranceRequestId: string;
            policyNumber: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
        } | null;
    } & {
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOffers(id: string, dto: UpdateOfferDto): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOffer(id: string, dto: UpdateOfferDto, userId: string): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadPolicy(id: string, file: Express.Multer.File, userId: string): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
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
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    notifyPayment(id: string, method: string, userId: string): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    confirmPayment(id: string, userId: string, file?: Express.Multer.File): Promise<{
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        company: string;
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
    }>;
    getMyCustomers(userId: string): Promise<{
        id: string;
        fullName: string;
        phone: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tc_kn: string;
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
                email: string | null;
                tc_kn: string;
                notes: string | null;
            } | null;
        } & {
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        company: string;
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
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
        fullName: string;
        phone: string;
        taliId: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tc_kn: string;
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
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                tc_kn: string;
                notes: string | null;
            } | null;
        } & {
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        company: string;
        id: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
        createdAt: Date;
        updatedAt: Date;
        insuranceRequestId: string;
        policyNumber: string;
        startDate: Date;
        endDate: Date;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
    })[]>;
    createCancellationRequest(policyId: string, reason: string, userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        policyId: string;
        reason: string;
        proofFiles: string[];
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
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                tc_kn: string;
                notes: string | null;
            } | null;
        } & {
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
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
        policyId: string;
        reason: string;
        proofFiles: string[];
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
                fullName: string;
                phone: string;
                taliId: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                tc_kn: string;
                notes: string | null;
            } | null;
        } & {
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
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
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
    updateCancellationStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
}
