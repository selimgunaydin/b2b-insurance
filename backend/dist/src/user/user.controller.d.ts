import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<({
        taliProfile: {
            id: string;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            points: import("@prisma/client/runtime/library").Decimal;
            allowedInsuranceTypes: string[];
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findAll(): Promise<({
        taliProfile: {
            id: string;
            membershipType: import("@prisma/client").$Enums.MembershipType;
            fullName: string;
            tcKimlikNo: string | null;
            phone: string | null;
            address: string | null;
            birthDate: Date | null;
            hasKvkkApproval: boolean;
            hasContractApproval: boolean;
            points: import("@prisma/client/runtime/library").Decimal;
            allowedInsuranceTypes: string[];
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    approveUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    rejectUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePermissions(id: string, body: {
        allowedTypes: string[];
    }): Promise<{
        id: string;
        membershipType: import("@prisma/client").$Enums.MembershipType;
        fullName: string;
        tcKimlikNo: string | null;
        phone: string | null;
        address: string | null;
        birthDate: Date | null;
        hasKvkkApproval: boolean;
        hasContractApproval: boolean;
        points: import("@prisma/client/runtime/library").Decimal;
        allowedInsuranceTypes: string[];
        userId: string;
    } | null>;
}
