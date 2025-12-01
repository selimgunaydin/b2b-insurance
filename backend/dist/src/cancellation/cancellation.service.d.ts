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
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
    findAll(): Promise<({
        policy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InsuranceType;
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
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
    updateStatus(id: string, dto: UpdateCancellationStatusDto): Promise<{
        policy: {
            policy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                company: string;
                status: import("@prisma/client").$Enums.PolicyStatus;
                policyUrl: string | null;
                startDate: Date;
                endDate: Date;
                premium: import("@prisma/client/runtime/library").Decimal;
                insuranceRequestId: string;
                policyNumber: string;
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
            details: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            offerFileUrl: string | null;
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
}
