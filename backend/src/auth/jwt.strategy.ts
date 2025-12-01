import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.access_token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // Use env var in production
    });
  }

  async validate(payload: any) {
    console.log('JwtStrategy validate payload:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    console.log('JwtStrategy found user:', user ? user.email : 'NOT FOUND');
    if (!user) {
      return null;
    }

    if (user.role === 'TALI' && !user.isApproved) {
      throw new UnauthorizedException(
        'Hesabınız henüz onaylanmamış. Lütfen yönetici onayı bekleyin.',
      );
    }

    const { password, ...result } = user;
    return result;
  }
}
