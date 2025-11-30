import { Role } from '@prisma/client';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    role?: Role;
    fullName: string;
    tcKimlikNo: string;
    phone: string;
    address?: string;
    birthDate?: string;
    hasKvkkApproval: boolean;
    hasContractApproval: boolean;
}
