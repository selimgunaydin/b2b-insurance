import { CompanyService } from './company.service';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    getActiveCompanies(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }[]>;
    getAllCompanies(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }[]>;
    createCompany(data: {
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
    updateCompany(id: string, data: {
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
    deleteCompany(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        logoUrl: string | null;
        isActive: boolean;
    }>;
}
