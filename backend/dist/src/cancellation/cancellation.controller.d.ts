import { CancellationService } from './cancellation.service';
import { CreateCancellationDto, UpdateCancellationStatusDto } from './dto/cancellation.dto';
export declare class CancellationController {
    private readonly cancellationService;
    constructor(cancellationService: CancellationService);
    create(createCancellationDto: CreateCancellationDto): Promise<{
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.CancellationStatus;
        policyId: string;
        reason: string;
        proofFiles: string[];
    }>;
}
