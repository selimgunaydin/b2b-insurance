import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async getAllContent() {
    return this.cmsService.getAllContent();
  }

  @Get('category/:category')
  async getContentByCategory(@Param('category') category: string) {
    return this.cmsService.getContentByCategory(category);
  }

  @Get(':key')
  async getContentByKey(@Param('key') key: string) {
    return this.cmsService.getContentByKey(key);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async upsertContent(
    @Body()
    body: {
      key: string;
      value: string;
      type: string;
      category: string;
    },
  ) {
    return this.cmsService.upsertContent(
      body.key,
      body.value,
      body.type,
      body.category,
    );
  }

  @Delete(':key')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async deleteContent(@Param('key') key: string) {
    return this.cmsService.deleteContent(key);
  }

  @Post('initialize')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async initializeDefaults() {
    await this.cmsService.initializeDefaults();
    return { message: 'Default content initialized' };
  }
}
