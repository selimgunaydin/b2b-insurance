import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InsuranceService } from './insurance.service';
import { OcrService } from '../ocr/ocr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInsuranceRequestDto, UpdateOfferDto } from './dto/insurance.dto';
// import { UpdateOfferDto } from './dto/update-offer.dto'; // Removed
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('insurance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InsuranceController {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly ocrService: OcrService,
  ) { }

  @Post()
  @Roles(Role.TALI)
  async create(
    @Request() req: any,
    @Body() createInsuranceRequestDto: CreateInsuranceRequestDto,
  ) {
    return this.insuranceService.create(req.user.id, createInsuranceRequestDto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.insuranceService.findAll(req.user.id, req.user.role);
  }

  @Get('stats')
  @Roles(Role.TALI)
  async getStats(@Request() req: any) {
    return this.insuranceService.getStats(req.user.id);
  }

  @Get('recent')
  @Roles(Role.TALI)
  async getRecent(@Request() req: any) {
    return this.insuranceService.getRecentRequests(req.user.id);
  }

  @Get('my/customers')
  @Roles(Role.TALI)
  async getMyCustomers(@Request() req: any) {
    return this.insuranceService.getMyCustomers(req.user.id);
  }

  @Get('my/policies')
  @Roles(Role.TALI)
  async getMyPolicies(@Request() req: any) {
    return this.insuranceService.getMyPolicies(req.user.id);
  }

  @Get('customers/all')
  @Roles(Role.ADMIN)
  async getAllCustomers() {
    return this.insuranceService.getAllCustomers();
  }

  @Get('policies/all')
  @Roles(Role.ADMIN)
  async getAllPolicies() {
    return this.insuranceService.getAllPolicies();
  }

  @Get('policy/:id')
  @Roles(Role.ADMIN)
  async getPolicyById(@Param('id') id: string) {
    return this.insuranceService.getPolicyById(id);
  }

  @Put('policy/:id/cancel')
  @Roles(Role.ADMIN)
  async cancelPolicy(@Param('id') id: string, @Request() req: any) {
    return this.insuranceService.cancelPolicyDirectly(id, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.insuranceService.findOne(id);
  }

  @Put(':id/offers')
  @Roles(Role.ADMIN)
  async updateOffers(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.insuranceService.updateOffers(id, updateOfferDto);
  }

  @Post(':id/policy-upload')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPolicy(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.insuranceService.uploadPolicy(id, file, req.user.id);
  }

  @Put(':id/policy')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updatePolicy(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    const data = {
      policyNumber: body.policyNumber,
      company: body.company,
      premium: body.premium ? Number(body.premium) : undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };
    return this.insuranceService.updatePolicyDetails(
      id,
      data,
      file,
      req.user.id,
    );
  }

  @Post(':id/approve-offer')
  @Roles(Role.TALI)
  async approveOffer(
    @Param('id') id: string,
    @Body()
    body: {
      selectedOffer: { company: string; price: number; description?: string };
    },
    @Request() req: any,
  ) {
    return this.insuranceService.approveOffer(
      id,
      req.user.id,
      body.selectedOffer,
    );
  }

  @Post(':id/confirm-payment')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async confirmPayment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Body() body: any,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    return this.insuranceService.confirmPayment(id, req.user.id, file, body);
  }

  @Post(':id/notify-payment')
  @Roles(Role.TALI)
  async notifyPayment(
    @Param('id') id: string,
    @Body() body: { method: string },
    @Request() req: any,
  ) {
    return this.insuranceService.notifyPayment(id, body.method, req.user.id);
  }

  @Post('cancellation')
  @Roles(Role.TALI)
  @UseInterceptors(FileInterceptor('file'))
  async createCancellationRequest(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.insuranceService.createCancellationRequest(
      body.policyId,
      body.reason,
      req.user.id,
      body.contactPhone,
      file,
    );
  }

  @Get('cancellations/all')
  @Roles(Role.ADMIN)
  async getCancellationRequests(@Request() req: any) {
    return this.insuranceService.getCancellationRequests(req.user.id);
  }

  @Get('cancellation/:id')
  @Roles(Role.ADMIN)
  async getCancellationRequest(@Param('id') id: string, @Request() req: any) {
    return this.insuranceService.getCancellationRequest(id, req.user.id);
  }

  @Put('cancellation/:id/status')
  @Roles(Role.ADMIN)
  async updateCancellationStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; adminResponse?: string },
    @Request() req: any,
  ) {
    return this.insuranceService.updateCancellationStatus(
      id,
      body.status,
      req.user.id,
      body.adminResponse,
    );
  }
  @Post('ocr')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async processOcr(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    // We need to save the file temporarily or pass buffer to service
    // For simplicity with tesseract.js in node, we can write to temp file
    const tempPath = `./uploads/temp-${Date.now()}-${file.originalname}`;
    const fs = require('fs');
    fs.writeFileSync(tempPath, file.buffer);

    try {
      const result = await this.ocrService.processImage(tempPath);
      fs.unlinkSync(tempPath); // Cleanup
      return result;
    } catch (e) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      throw e;
    }
  }
}
