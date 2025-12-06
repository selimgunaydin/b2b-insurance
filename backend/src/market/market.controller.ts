import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, PurchaseStatus } from '@prisma/client';

@Controller('market')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('products')
  async getAllProducts(@Query('activeOnly') activeOnly?: string) {
    // If Admin, show all. If Tali, show active only by default unless specified otherwise?
    // Actually, Tali should only see active. Admin sees all.
    // Let's simplify: Tali sees active. Admin sees all.
    // But we can pass a query param.
    const isActive = activeOnly === 'true';
    return this.marketService.getAllProducts(isActive);
  }

  // === CATEGORY ENDPOINTS ===
  @Get('categories')
  async getAllCategories(@Query('activeOnly') activeOnly?: string) {
    return this.marketService.getAllCategories(activeOnly === 'true');
  }

  @Post('categories')
  @Roles(Role.ADMIN)
  async createCategory(@Body() data: { name: string; description?: string }) {
    return this.marketService.createCategory(data);
  }

  @Put('categories/:id')
  @Roles(Role.ADMIN)
  async updateCategory(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.marketService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @Roles(Role.ADMIN)
  async deleteCategory(@Param('id') id: string) {
    return this.marketService.deleteCategory(id);
  }

  // === PRODUCT ENDPOINTS ===

  @Post('products')
  @Roles(Role.ADMIN)
  async createProduct(
    @Body()
    data: {
      name: string;
      description?: string;
      imageUrl?: string;
      pointCost: number;
      stock: number;
      type?: 'PHYSICAL' | 'DIGITAL';
      category?: string;
    },
  ) {
    return this.marketService.createProduct(data);
  }

  @Put('products/:id')
  @Roles(Role.ADMIN)
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.marketService.updateProduct(id, data);
  }

  @Delete('products/:id')
  @Roles(Role.ADMIN)
  async deleteProduct(@Param('id') id: string) {
    return this.marketService.deleteProduct(id);
  }

  @Post('purchase/:productId')
  @Roles('TALI')
  purchaseProduct(
    @Param('productId') productId: string,
    @Request() req: any,
    @Body() body: { details?: any },
  ) {
    return this.marketService.purchaseProduct(
      req.user.id,
      productId,
      body.details,
    );
  }

  @Get('my-purchases')
  @Roles('TALI')
  getMyPurchases(@Request() req: any) {
    return this.marketService.getMyPurchases(req.user.id);
  }

  @Get('purchases')
  @Roles(Role.ADMIN)
  async getAllPurchases() {
    return this.marketService.getAllPurchases();
  }

  @Put('purchase/:id/status')
  @Roles(Role.ADMIN)
  async updatePurchaseStatus(
    @Param('id') id: string,
    @Body()
    body: { status: PurchaseStatus; fulfillmentData?: any; adminNote?: string },
  ) {
    return this.marketService.updatePurchaseStatus(
      id,
      body.status,
      body.fulfillmentData,
      body.adminNote,
    );
  }
}
