import { InsuranceService } from './insurance.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
export declare class InsuranceController {
    private readonly insuranceService;
    constructor(insuranceService: InsuranceService);
    create(req: any, createInsuranceRequestDto: CreateInsuranceRequestDto): Promise<{
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
    findAll(req: any): Promise<({
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
    getStats(req: any): Promise<{
        activePolicies: number;
        pendingOffers: number;
        totalEarnings: number;
    }>;
    getRecent(req: any): Promise<({
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
    getMyCustomers(req: any): Promise<{
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
    getMyPolicies(req: any): Promise<({
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
    updateOffers(id: string, updateOfferDto: UpdateOfferDto): Promise<{
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
    uploadPolicy(id: string, file: Express.Multer.File, req: any): Promise<{
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
    approveOffer(id: string, body: {
        selectedOffer: {
            company: string;
            price: number;
            description?: string;
        };
    }, req: any): Promise<{
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
    confirmPayment(id: string, req: any, file?: Express.Multer.File): Promise<{
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
    notifyPayment(id: string, body: {
        method: string;
    }, req: any): Promise<{
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
    createCancellationRequest(body: {
        policyId: string;
        reason: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        policyId: string;
        reason: string;
        proofFiles: string[];
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
    updateCancellationStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
}
