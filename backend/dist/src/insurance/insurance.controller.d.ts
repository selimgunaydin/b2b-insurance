import { InsuranceService } from './insurance.service';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
export declare class InsuranceController {
    private readonly insuranceService;
    constructor(insuranceService: InsuranceService);
    create(req: any, createInsuranceRequestDto: CreateInsuranceRequestDto): Promise<{
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
    findAll(req: any): Promise<({
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
    getStats(req: any): Promise<{
        activePolicies: number;
        pendingOffers: number;
        totalEarnings: number;
    }>;
    getRecent(req: any): Promise<({
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
    getMyCustomers(req: any): Promise<{
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
    getMyPolicies(req: any): Promise<({
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
    updateOffers(id: string, updateOfferDto: UpdateOfferDto): Promise<{
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
    uploadPolicy(id: string, file: Express.Multer.File, req: any): Promise<{
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
    updatePolicy(id: string, file: Express.Multer.File, body: any, req: any): Promise<{
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
    confirmPayment(id: string, req: any, file?: Express.Multer.File): Promise<{
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
    notifyPayment(id: string, body: {
        method: string;
    }, req: any): Promise<{
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
    createCancellationRequest(body: {
        policyId: string;
        reason: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
    getCancellationRequests(req: any): Promise<({
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
    getCancellationRequest(id: string, req: any): Promise<{
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
    updateCancellationStatus(id: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
}
