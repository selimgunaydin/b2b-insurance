import { PrismaService } from '../prisma/prisma.service';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }[]>;
    findActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }[]>;
    create(data: {
        name: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }>;
    update(id: string, data: {
        name?: string;
        logoUrl?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }>;
}
