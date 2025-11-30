import { IsString, IsEmail, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  message: string;
}
