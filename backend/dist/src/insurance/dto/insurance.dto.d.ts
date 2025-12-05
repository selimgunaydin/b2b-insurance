import { InsuranceType } from '@prisma/client';
export declare class CustomerDataDto {
    tcKn: string;
    fullName: string;
    phone: string;
    email?: string;
}
export declare class InsuranceDetailsDto {
    plateNumber?: string;
    licenseSerial?: string;
    asbisNo?: string;
}
export declare class CreateInsuranceRequestDto {
    customerId?: string;
    customerData?: CustomerDataDto;
    type: InsuranceType;
    details: any;
    files?: string[];
}
export declare class OfferItemDto {
    price: number;
    company: string;
    description?: string;
    fileUrl?: string;
}
export declare class UpdateOfferDto {
    offerFileUrl?: string;
    offers: OfferItemDto[];
}
export declare class CreateCancellationRequestDto {
    policyId: string;
    reason: string;
    contactPhone?: string;
}
