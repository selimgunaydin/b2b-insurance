import { InsuranceService } from './insurance.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
export declare class InsuranceController {
    private readonly insuranceService;
    constructor(insuranceService: InsuranceService);
    create(req: any, createInsuranceRequestDto: CreateInsuranceRequestDto): Promise<{
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
    findAll(req: any): Promise<({
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
    getStats(req: any): Promise<{
        totalEarnings: number | import("@prisma/client/runtime/library").Decimal;
        activePolicies: number;
        pendingOffers: number;
    } | null>;
    getRecent(req: any): Promise<({
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
    getMyCustomers(req: any): Promise<{
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
    getMyPolicies(req: any): Promise<({
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
    updateOffers(id: string, updateOfferDto: UpdateOfferDto): Promise<{
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
    uploadPolicy(id: string, file: Express.Multer.File, req: any): Promise<{
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
    updatePolicy(id: string, file: Express.Multer.File, body: any, req: any): Promise<{
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
    approveOffer(id: string, body: {
        selectedOffer: {
            company: string;
            price: number;
            description?: string;
        };
    }, req: any): Promise<{
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
    confirmPayment(id: string, req: any, file?: Express.Multer.File): Promise<{
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
    notifyPayment(id: string, body: {
        method: string;
    }, req: any): Promise<{
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
    createCancellationRequest(body: {
        policyId: string;
        reason: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
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
    updateCancellationStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.CancellationStatus;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        proofFiles: string[];
        policyId: string;
    }>;
}
