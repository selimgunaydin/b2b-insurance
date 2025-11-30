import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OfferItemDto {
  @IsString()
  company: string;

  @IsNumber()
  price: number;

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
