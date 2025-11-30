import { InsuranceService } from './insurance.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
export declare class InsuranceController {
    private readonly insuranceService;
    constructor(insuranceService: InsuranceService);
    create(req: any, createInsuranceRequestDto: CreateInsuranceRequestDto): Promise<{
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
    findAll(req: any): Promise<({
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
    getStats(req: any): Promise<{
        activePolicies: number;
        pendingOffers: number;
        totalEarnings: number;
    }>;
    getRecent(req: any): Promise<({
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
    getMyCustomers(req: any): Promise<{
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
    getMyPolicies(req: any): Promise<({
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
    updateOffers(id: string, updateOfferDto: UpdateOfferDto): Promise<{
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
    uploadPolicy(id: string, file: Express.Multer.File, req: any): Promise<{
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
    approveOffer(id: string, body: {
        selectedOffer: {
            company: string;
            price: number;
            description?: string;
        };
    }, req: any): Promise<{
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
    confirmPayment(id: string, req: any, file?: Express.Multer.File): Promise<{
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
    notifyPayment(id: string, body: {
        method: string;
    }, req: any): Promise<{
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
    createCancellationRequest(body: {
        policyId: string;
        reason: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
    getCancellationRequests(req: any): Promise<({
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
    getCancellationRequest(id: string, req: any): Promise<{
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
    updateCancellationStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
}
