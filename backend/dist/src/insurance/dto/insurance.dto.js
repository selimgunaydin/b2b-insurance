"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOfferDto = exports.OfferItemDto = exports.CreateInsuranceRequestDto = exports.InsuranceDetailsDto = exports.CustomerDataDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CustomerDataDto {
    tcKn;
    fullName;
    phone;
    email;
}
exports.CustomerDataDto = CustomerDataDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDataDto.prototype, "tcKn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDataDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDataDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CustomerDataDto.prototype, "email", void 0);
class InsuranceDetailsDto {
    plaka;
    ruhsatSeriNo;
    asbisNo;
}
exports.InsuranceDetailsDto = InsuranceDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InsuranceDetailsDto.prototype, "plaka", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InsuranceDetailsDto.prototype, "ruhsatSeriNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InsuranceDetailsDto.prototype, "asbisNo", void 0);
class CreateInsuranceRequestDto {
    customerId;
    customerData;
    type;
    details;
    files;
}
exports.CreateInsuranceRequestDto = CreateInsuranceRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInsuranceRequestDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomerDataDto),
    __metadata("design:type", CustomerDataDto)
], CreateInsuranceRequestDto.prototype, "customerData", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.InsuranceType),
    __metadata("design:type", String)
], CreateInsuranceRequestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => InsuranceDetailsDto),
    __metadata("design:type", InsuranceDetailsDto)
], CreateInsuranceRequestDto.prototype, "details", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateInsuranceRequestDto.prototype, "files", void 0);
class OfferItemDto {
    price;
    company;
    description;
    fileUrl;
}
exports.OfferItemDto = OfferItemDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OfferItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OfferItemDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OfferItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OfferItemDto.prototype, "fileUrl", void 0);
class UpdateOfferDto {
    offerFileUrl;
    offers;
}
exports.UpdateOfferDto = UpdateOfferDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOfferDto.prototype, "offerFileUrl", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OfferItemDto),
    __metadata("design:type", Array)
], UpdateOfferDto.prototype, "offers", void 0);
//# sourceMappingURL=insurance.dto.js.map