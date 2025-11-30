import { InsuranceType } from '@prisma/client';
export declare class CreateInsuranceRequestDto {
    customerId?: string;
    customerData?: any;
    type: InsuranceType;
    details: any;
    files?: string[];
}
export declare class OfferItemDto {
    price: number;
    company: string;
    description?: string;
}
export declare class UpdateOfferDto {
    offers: OfferItemDto[];
}
