import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { CancellationStatus } from '@prisma/client';

export class CreateCancellationDto {
  @IsString()
  policyId: string;

  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsArray()
  @IsOptional()
  proofFiles?: string[];
}

export class UpdateCancellationStatusDto {
  @IsEnum(CancellationStatus)
  status: CancellationStatus;

  @IsString()
  @IsOptional()
  adminResponse?: string;
}

