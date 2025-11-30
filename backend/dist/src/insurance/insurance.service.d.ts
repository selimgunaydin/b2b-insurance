import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
import { NotificationService } from '../notification/notification.service';
import { SupabaseService } from '../supabase/supabase.service';
import { GoalService } from '../goal/goal.service';
export declare class InsuranceService {
    private prisma;
    private auditService;
    private supabaseService;
    private notificationService;
    private goalService;
    constructor(prisma: PrismaService, auditService: AuditService, supabaseService: SupabaseService, notificationService: NotificationService, goalService: GoalService);
    getStats(userId: string): Promise<{
        activePolicies: number;
        pendingOffers: number;
        totalEarnings: number;
    }>;
    getRecentRequests(userId: string): Promise<({
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
        policy: {
            id: string;
            startDate: Date;
            endDate: Date;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PolicyStatus;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    findAll(userId: string, role: string): Promise<({
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
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
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            fullName: string;
            phone: string;
            tc_kn: string;
            email: string | null;
            notes: string | null;
        } | null;
        policy: {
            id: string;
            startDate: Date;
            endDate: Date;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PolicyStatus;
            insuranceRequestId: string;
            policyNumber: string;
            company: string;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    confirmPayment(id: string, userId: string, file?: Express.Multer.File): Promise<{
        id: string;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PolicyStatus;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        customerId: string | null;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyUrl: string | null;
    }>;
    getMyCustomers(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
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
                createdAt: Date;
                updatedAt: Date;
                taliId: string;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PolicyStatus;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
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
        createdAt: Date;
        updatedAt: Date;
        taliId: string;
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
                createdAt: Date;
                updatedAt: Date;
                taliId: string;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOffer: import("@prisma/client/runtime/library").JsonValue | null;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyUrl: string | null;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PolicyStatus;
        insuranceRequestId: string;
        policyNumber: string;
        company: string;
        premium: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
    })[]>;
    createCancellationRequest(policyId: string, reason: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
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
                createdAt: Date;
                updatedAt: Date;
                taliId: string;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
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
                createdAt: Date;
                updatedAt: Date;
                taliId: string;
                fullName: string;
                phone: string;
                tc_kn: string;
                email: string | null;
                notes: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taliId: string;
            status: import("@prisma/client").$Enums.RequestStatus;
            customerId: string | null;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
    updateCancellationStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
}
