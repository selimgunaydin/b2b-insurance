import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
import { SupabaseService } from '../supabase/supabase.service';
export declare class InsuranceService {
    private prisma;
    private auditService;
    private supabaseService;
    constructor(prisma: PrismaService, auditService: AuditService, supabaseService: SupabaseService);
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
        };
        policy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            company: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            insuranceRequestId: string;
            policyNumber: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    })[]>;
    create(userId: string, dto: CreateInsuranceRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
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
        };
        policy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            company: string;
            status: import("@prisma/client").$Enums.PolicyStatus;
            insuranceRequestId: string;
            policyNumber: string;
            startDate: Date;
            endDate: Date;
            premium: import("@prisma/client/runtime/library").Decimal;
            commission: import("@prisma/client/runtime/library").Decimal;
            pdfUrl: string | null;
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
            balance: import("@prisma/client/runtime/library").Decimal;
            allowedInsuranceTypes: string[];
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    }>;
    updateOffers(id: string, dto: UpdateOfferDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    }>;
    updateOffer(id: string, dto: UpdateOfferDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    }>;
    uploadPolicy(id: string, file: Express.Multer.File, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
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
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    }>;
    notifyPayment(id: string, method: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    }>;
    confirmPayment(id: string, userId: string, file?: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InsuranceType;
        details: import("@prisma/client/runtime/library").JsonValue;
        customerId: string;
        files: string[];
        offers: import("@prisma/client/runtime/library").JsonValue | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        taliId: string;
        adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
        adminOfferCompany: string | null;
        adminOfferDescription: string | null;
        policyPdfUrl: string | null;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string;
            files: string[];
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyPdfUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
                    membershipType: import("@prisma/client").$Enums.MembershipType;
                    fullName: string;
                    tcKimlikNo: string | null;
                    phone: string | null;
                    address: string | null;
                    birthDate: Date | null;
                    hasKvkkApproval: boolean;
                    hasContractApproval: boolean;
                    balance: import("@prisma/client/runtime/library").Decimal;
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
            balance: import("@prisma/client/runtime/library").Decimal;
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
            };
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
                        balance: import("@prisma/client/runtime/library").Decimal;
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
                balance: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string;
            files: string[];
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyPdfUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        company: string;
        status: import("@prisma/client").$Enums.PolicyStatus;
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
            };
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
                balance: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string;
            files: string[];
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyPdfUrl: string | null;
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
            };
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
                balance: import("@prisma/client/runtime/library").Decimal;
                allowedInsuranceTypes: string[];
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string;
            files: string[];
            offers: import("@prisma/client/runtime/library").JsonValue | null;
            status: import("@prisma/client").$Enums.RequestStatus;
            taliId: string;
            adminOfferPrice: import("@prisma/client/runtime/library").Decimal | null;
            adminOfferCompany: string | null;
            adminOfferDescription: string | null;
            policyPdfUrl: string | null;
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
