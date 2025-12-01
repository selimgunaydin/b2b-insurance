import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/approve')
  async approveUser(@Param('id') id: string) {
    return this.userService.approveUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/reject')
  async rejectUser(@Param('id') id: string) {
    return this.userService.rejectUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() body: { allowedTypes: string[] },
  ) {
    return this.userService.updatePermissions(id, body.allowedTypes);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/profile')
  async adminUpdateProfile(@Param('id') id: string, @Body() body: any) {
    return this.userService.adminUpdateProfile(id, body);
  }
}
