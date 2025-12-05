import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class SendNotificationDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsOptional()
  userIds?: string[];

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  message: string;

  @IsString()
  title: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsString()
  @IsOptional()
  target?: 'ALL' | 'USER' | 'USERS';
}
