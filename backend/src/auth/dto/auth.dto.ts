import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Role } from '@prisma/client';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  tcKimlikNo: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  birthDate?: string; // ISO Date string

  @IsBoolean()
  hasKvkkApproval: boolean;

  @IsBoolean()
  hasContractApproval: boolean;
}
