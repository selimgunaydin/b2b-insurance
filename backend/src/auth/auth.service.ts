import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<User> {
    const {
      email,
      password,
      role,
      fullName,
      tcKimlikNo,
      phone,
      address,
      birthDate,
      hasKvkkApproval,
      hasContractApproval,
    } = registerDto;

    const allowRegistration = await this.prisma.systemSetting.findUnique({
      where: { key: 'allow_new_registration' },
    });

    if (allowRegistration && allowRegistration.value === 'false') {
      throw new ConflictException('Yeni üye alımı şu anda kapalıdır.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to ensure both User and Profile are created
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || Role.TALI,
          isApproved: role === Role.ADMIN ? true : false, // Admins auto-approved (for seeding/testing), Talis need approval
        },
      });

      if (user.role === Role.TALI) {
        await prisma.taliProfile.create({
          data: {
            userId: user.id,
            fullName,
            tcKimlikNo,
            phone,
            address,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            hasKvkkApproval,
            hasContractApproval,
          },
        });
      }

      return user;
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    if (user.role === Role.TALI && !user.isApproved) {
      throw new UnauthorizedException(
        'Hesabınız henüz onaylanmamış. Lütfen yönetici onayı bekleyin.',
      );
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
