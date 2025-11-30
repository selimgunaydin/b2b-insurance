import { CompanyService } from './company.service';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getActiveCompanies(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        logoUrl: string | null;
    }[]>;
    getAllCompanies(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        logoUrl: string | null;
    }[]>;
    createCompany(data: {
        name: string;
        logoUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        logoUrl: string | null;
    }>;
    updateCompany(id: string, data: {
        name?: string;
        logoUrl?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        logoUrl: string | null;
    }>;
    deleteCompany(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        logoUrl: string | null;
    }>;
}
