import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { taliProfile: true },
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
}
