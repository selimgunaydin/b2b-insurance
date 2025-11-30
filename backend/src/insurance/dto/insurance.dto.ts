import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InsuranceType } from '@prisma/client';

export class CreateInsuranceRequestDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsObject()
  @IsOptional()
  customerData?: any;

  @IsEnum(InsuranceType)
  type: InsuranceType;

  @IsObject()
  details: any; // JSONB content

  @IsArray()
  @IsOptional()
  files?: string[];
}

export class OfferItemDto {
  @IsNumber()
  price: number;

  @IsString()
  company: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateOfferDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferItemDto)
  offers: OfferItemDto[];
}
