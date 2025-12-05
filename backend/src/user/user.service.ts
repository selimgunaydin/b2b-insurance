import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        taliProfile: {
          include: {
            badges: {
              include: { badge: true },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { taliProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async rejectUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isApproved: false },
    });
  }

  async updatePermissions(userId: string, allowedTypes: string[]) {
    // Check if user is TALI
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (user && user.taliProfile) {
      return this.prisma.taliProfile.update({
        where: { id: user.taliProfile.id },
        data: { allowedInsuranceTypes: allowedTypes },
      });
    }
    return null;
  }
  async updateProfile(
    userId: string,
    data: { phone?: string; address?: string; birthDate?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (user && user.taliProfile) {
      return this.prisma.taliProfile.update({
        where: { id: user.taliProfile.id },
        data: {
          phone: data.phone,
          address: data.address,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        },
      });
    }
    return null;
  }

  async adminUpdateProfile(
    userId: string,
    data: {
      fullName?: string;
      tcKimlikNo?: string;
      phone?: string;
      address?: string;
      birthDate?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taliProfile: true },
    });

    if (user && user.taliProfile) {
      return this.prisma.taliProfile.update({
        where: { id: user.taliProfile.id },
        data: {
          fullName: data.fullName,
          tcKimlikNo: data.tcKimlikNo,
          phone: data.phone,
          address: data.address,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        },
      });
    }
    return null;
  }
}
