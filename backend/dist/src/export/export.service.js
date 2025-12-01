"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = __importStar(require("exceljs"));
let ExportService = class ExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportUsers(res) {
        const users = await this.prisma.user.findMany({
            include: {
                taliProfile: true,
            },
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kullanıcılar');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'E-posta', key: 'email', width: 30 },
            { header: 'Ad Soyad', key: 'fullName', width: 30 },
            { header: 'Telefon', key: 'phone', width: 15 },
            { header: 'Rol', key: 'role', width: 10 },
            { header: 'Puan', key: 'points', width: 10 },
            { header: 'Premium', key: 'isPremium', width: 10 },
            { header: 'Kayıt Tarihi', key: 'createdAt', width: 20 },
        ];
        users.forEach((user) => {
            worksheet.addRow({
                id: user.id,
                email: user.email,
                fullName: user.taliProfile?.fullName || '-',
                phone: user.taliProfile?.phone || '-',
                role: user.role,
                points: user.taliProfile?.points || 0,
                isPremium: user.taliProfile?.isPremium ? 'Evet' : 'Hayır',
                createdAt: user.createdAt.toISOString().split('T')[0],
            });
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportCustomers(res) {
        const customers = await this.prisma.customer.findMany({
            include: {
                tali: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Müşteriler');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Ad Soyad', key: 'fullName', width: 30 },
            { header: 'TCKN', key: 'tcKimlikNo', width: 15 },
            { header: 'Telefon', key: 'phone', width: 15 },
            { header: 'Tali', key: 'tali', width: 30 },
            { header: 'Kayıt Tarihi', key: 'createdAt', width: 20 },
        ];
        customers.forEach((customer) => {
            worksheet.addRow({
                id: customer.id,
                fullName: customer.fullName,
                tcKimlikNo: customer.tc_kn,
                phone: customer.phone,
                tali: customer.tali?.fullName || customer.tali?.user?.email || '-',
                createdAt: customer.createdAt.toISOString().split('T')[0],
            });
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportPolicies(res) {
        const policies = await this.prisma.policy.findMany({
            include: {
                insuranceRequest: {
                    include: {
                        customer: true,
                        tali: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Poliçeler');
        worksheet.columns = [
            { header: 'Poliçe No', key: 'policyNumber', width: 20 },
            { header: 'Müşteri', key: 'customer', width: 30 },
            { header: 'Şirket', key: 'company', width: 20 },
            { header: 'Tür', key: 'type', width: 15 },
            { header: 'Prim', key: 'premium', width: 15 },
            { header: 'Komisyon', key: 'commission', width: 15 },
            { header: 'Tali', key: 'tali', width: 30 },
            { header: 'Başlangıç', key: 'startDate', width: 15 },
            { header: 'Bitiş', key: 'endDate', width: 15 },
        ];
        policies.forEach((policy) => {
            worksheet.addRow({
                policyNumber: policy.policyNumber,
                customer: policy.insuranceRequest?.customer?.fullName || '-',
                company: policy.company,
                type: policy.insuranceRequest?.type,
                premium: policy.premium,
                commission: policy.commissionPoints || 0,
                tali: policy.insuranceRequest?.tali?.fullName ||
                    policy.insuranceRequest?.tali?.user?.email ||
                    '-',
                startDate: policy.startDate.toISOString().split('T')[0],
                endDate: policy.endDate.toISOString().split('T')[0],
            });
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=policies.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
    async exportOffers(res) {
        const requests = await this.prisma.insuranceRequest.findMany({
            include: {
                customer: true,
                tali: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Teklifler');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Müşteri', key: 'customer', width: 30 },
            { header: 'Tür', key: 'type', width: 15 },
            { header: 'Durum', key: 'status', width: 15 },
            { header: 'Tali', key: 'tali', width: 30 },
            { header: 'Tarih', key: 'createdAt', width: 20 },
            { header: 'Teklif Sayısı', key: 'offerCount', width: 15 },
        ];
        requests.forEach((req) => {
            const offers = req.offers;
            worksheet.addRow({
                id: req.id,
                customer: req.customer?.fullName || '-',
                type: req.type,
                status: req.status,
                tali: req.tali?.fullName || req.tali?.user?.email || '-',
                createdAt: req.createdAt.toISOString().split('T')[0],
                offerCount: offers?.length || 0,
            });
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=offers.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map