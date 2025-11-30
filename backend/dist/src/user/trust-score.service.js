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
exports.TrustScoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TrustScoreService = class TrustScoreService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    SCORES = {
        POLICY_COMPLETED: 10,
        POLICY_CANCELLED: -20,
        OFFER_REJECTED: -1,
        OFFER_EXPIRED: -2,
    };
    async updateTrustScore(taliId, event) {
        const change = this.SCORES[event];
        await this.prisma.taliProfile.update({
            where: { id: taliId },
            data: {
                trustScore: {
                    increment: change,
                },
            },
        });
    }
};
exports.TrustScoreService = TrustScoreService;
exports.TrustScoreService = TrustScoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrustScoreService);
//# sourceMappingURL=trust-score.service.js.map