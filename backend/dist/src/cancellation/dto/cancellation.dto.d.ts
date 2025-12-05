import { CancellationStatus } from '@prisma/client';
export declare class CreateCancellationDto {
    policyId: string;
    reason: string;
    contactPhone?: string;
    proofFiles?: string[];
}
export declare class UpdateCancellationStatusDto {
    status: CancellationStatus;
    adminResponse?: string;
}
