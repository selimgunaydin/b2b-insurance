import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.insuranceCompany.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findActive() {
        return this.prisma.insuranceCompany.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async create(data: { name: string; logoUrl?: string }) {
        return this.prisma.insuranceCompany.create({
            data,
        });
    }

    async update(id: string, data: { name?: string; logoUrl?: string; isActive?: boolean }) {
        return this.prisma.insuranceCompany.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.insuranceCompany.delete({
            where: { id },
        });
    }
}
