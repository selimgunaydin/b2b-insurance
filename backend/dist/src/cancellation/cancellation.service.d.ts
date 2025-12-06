import { PrismaService } from '../prisma/prisma.service';
import { CreateCancellationDto, UpdateCancellationStatusDto } from './dto/cancellation.dto';
import { NotificationService } from '../notification/notification.service';
export declare class CancellationService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    create(dto: CreateCancellationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        policyId: string;
        reason: string;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.CancellationStatus;
        proofFiles: string[];
        adminResponse: string | null;
    }>;
    findAll(): Promise<({
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
            policy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                company: string;
                status: import("@prisma/client").$Enums.PolicyStatus;
                startDate: Date;
                endDate: Date;
                policyUrl: string | null;
                insuranceRequestId: string;
                policyNumber: string;
                premium: import("@prisma/client/runtime/library").Decimal;
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
            taliId: string;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        policyId: string;
        reason: string;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.CancellationStatus;
        proofFiles: string[];
        adminResponse: string | null;
    })[]>;
    findByUser(userId: string): Promise<({
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
            policy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                company: string;
                status: import("@prisma/client").$Enums.PolicyStatus;
                startDate: Date;
                endDate: Date;
                policyUrl: string | null;
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
            taliId: string;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        policyId: string;
        reason: string;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.CancellationStatus;
        proofFiles: string[];
        adminResponse: string | null;
    })[]>;
    updateStatus(id: string, dto: UpdateCancellationStatusDto): Promise<{
        policy: {
            policy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                company: string;
                status: import("@prisma/client").$Enums.PolicyStatus;
                startDate: Date;
                endDate: Date;
                policyUrl: string | null;
                insuranceRequestId: string;
                policyNumber: string;
                premium: import("@prisma/client/runtime/library").Decimal;
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
            taliId: string;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
            offers: import("@prisma/client/runtime/library").JsonValue | null;
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
        policyId: string;
        reason: string;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.CancellationStatus;
        proofFiles: string[];
        adminResponse: string | null;
    }>;
}
