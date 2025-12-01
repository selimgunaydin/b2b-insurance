import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportUsers(res: Response) {
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

    users.forEach((user: any) => {
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

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportCustomers(res: Response) {
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

    customers.forEach((customer: any) => {
      worksheet.addRow({
        id: customer.id,
        fullName: customer.fullName,
        tcKimlikNo: customer.tc_kn,
        phone: customer.phone,
        tali: customer.tali?.fullName || customer.tali?.user?.email || '-',
        createdAt: customer.createdAt.toISOString().split('T')[0],
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportPolicies(res: Response) {
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

    policies.forEach((policy: any) => {
      worksheet.addRow({
        policyNumber: policy.policyNumber,
        customer: policy.insuranceRequest?.customer?.fullName || '-',
        company: policy.company,
        type: policy.insuranceRequest?.type,
        premium: policy.premium,
        commission: policy.commissionPoints || 0,
        tali:
          policy.insuranceRequest?.tali?.fullName ||
          policy.insuranceRequest?.tali?.user?.email ||
          '-',
        startDate: policy.startDate.toISOString().split('T')[0],
        endDate: policy.endDate.toISOString().split('T')[0],
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=policies.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportOffers(res: Response) {
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

    requests.forEach((req: any) => {
      const offers = req.offers as any[];
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

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=offers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
