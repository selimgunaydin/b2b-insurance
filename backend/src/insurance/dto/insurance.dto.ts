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

export class CustomerDataDto {
  @IsString()
  tcKn: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;
}

export class InsuranceDetailsDto {
  @IsString()
  @IsOptional()
  plaka?: string;

  @IsString()
  @IsOptional()
  ruhsatSeriNo?: string;

  @IsString()
  @IsOptional()
  asbisNo?: string;
}

export class CreateInsuranceRequestDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDataDto)
  customerData?: CustomerDataDto;

  @IsEnum(InsuranceType)
  type: InsuranceType;

  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceDetailsDto)
  details: InsuranceDetailsDto;

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

  @IsString()
  @IsOptional()
  fileUrl?: string;
}

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  offerFileUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferItemDto)
  offers: OfferItemDto[];
}
