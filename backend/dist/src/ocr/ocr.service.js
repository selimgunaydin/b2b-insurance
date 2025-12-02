"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OcrService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const Tesseract = __importStar(require("tesseract.js"));
const fs = __importStar(require("fs"));
const Levenshtein = __importStar(require("fast-levenshtein"));
const prisma_service_1 = require("../prisma/prisma.service");
let OcrService = OcrService_1 = class OcrService {
    prisma;
    logger = new common_1.Logger(OcrService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processImage(filePath) {
        const buffer = fs.readFileSync(filePath);
        const { data: { text }, } = await Tesseract.recognize(buffer, 'eng+tur');
        return this.extract(text);
    }
    async extract(text) {
        const dbCompanies = await this.prisma.insuranceCompany.findMany({
            where: { isActive: true },
        });
        this.logger.debug(`Loaded ${dbCompanies.length} companies from DB: ${dbCompanies.map((c) => c.name).join(', ')}`);
        const lines = text.split('\n').map((l) => l.trim());
        this.logger.debug(`Extracted ${lines.length} lines from text`);
        const results = [];
        const specialMappings = {
            'h hoi': 'HDI SİGORTA',
            hdi: 'HDI SİGORTA',
            'h d i': 'HDI SİGORTA',
            'h.d.i': 'HDI SİGORTA',
            mapfre: 'MAPFRE SİGORTA',
            sompo: 'SOMPO SİGORTA',
            'H Hoi': 'HDI SİGORTA',
        };
        for (const line of lines) {
            if (!line)
                continue;
            let bestMatchCompany = null;
            let minDistance = Infinity;
            const lowerLine = line.toLowerCase();
            for (const [key, value] of Object.entries(specialMappings)) {
                if (lowerLine.includes(key)) {
                    const dbMatch = dbCompanies.find((c) => c.name.toLowerCase().includes(value.toLowerCase()) ||
                        value.toLowerCase().includes(c.name.toLowerCase()));
                    if (dbMatch) {
                        bestMatchCompany = dbMatch.name;
                        break;
                    }
                }
            }
            if (!bestMatchCompany) {
                for (const dbCompany of dbCompanies) {
                    if (lowerLine.includes(dbCompany.name.toLowerCase())) {
                        bestMatchCompany = dbCompany.name;
                        break;
                    }
                }
            }
            if (!bestMatchCompany) {
                for (const dbCompany of dbCompanies) {
                    const targetLen = dbCompany.name.length;
                    const compareStr = lowerLine.slice(0, targetLen + 3);
                    const distance = Levenshtein.get(compareStr, dbCompany.name.toLowerCase());
                    const threshold = Math.max(3, Math.floor(targetLen * 0.4));
                    if (distance <= threshold && distance < minDistance) {
                        minDistance = distance;
                        bestMatchCompany = dbCompany.name;
                    }
                }
            }
            if (bestMatchCompany) {
                const price = this.extractCorrectPrice(line);
                if (price) {
                    results.push({ company: bestMatchCompany, price });
                }
            }
        }
        const uniqueResults = [];
        const map = new Map();
        for (const item of results) {
            if (!map.has(item.company)) {
                map.set(item.company, item.price);
                uniqueResults.push(item);
            }
        }
        return uniqueResults;
    }
    extractCorrectPrice(line) {
        const numericRegex = /(\d[\d.,]+)/g;
        const matches = [...line.matchAll(numericRegex)].map((m) => m[1]);
        if (matches.length === 0)
            return null;
        const candidates = matches.map((val) => this.normalizePrice(val));
        const validCandidates = candidates.filter((c) => c > 0 && c < 1000000);
        if (validCandidates.length === 0)
            return null;
        this.logger.debug(`Line: "${line}" -> Candidates: ${JSON.stringify(validCandidates)}`);
        const withDecimals = validCandidates.filter((c) => c % 1 !== 0);
        if (withDecimals.length > 0) {
            return Math.max(...withDecimals);
        }
        return Math.max(...validCandidates);
    }
    normalizePrice(input) {
        let str = input.trim();
        str = str.replace(/[^\d.,]/g, '');
        const lastDot = str.lastIndexOf('.');
        const lastComma = str.lastIndexOf(',');
        if (lastDot !== -1 && lastComma !== -1) {
            if (lastComma > lastDot) {
                str = str.replace(/\./g, '');
                str = str.replace(',', '.');
            }
            else {
                str = str.replace(/,/g, '');
            }
        }
        else if (lastComma !== -1) {
            if (str.split(',').length > 2) {
                str = str.replace(/,/g, '');
            }
            else {
                const parts = str.split(',');
                if (parts[1].length === 2) {
                    str = str.replace(',', '.');
                }
                else {
                    str = str.replace(',', '');
                }
            }
        }
        else if (lastDot !== -1) {
            if (str.split('.').length > 2) {
                str = str.replace(/\./g, '');
            }
            else {
                const parts = str.split('.');
                if (parts[1].length === 2) {
                }
                else if (parts[1].length === 3) {
                    str = str.replace(/\./g, '');
                }
            }
        }
        let num = parseFloat(str);
        if (isNaN(num))
            return 0;
        if (num < 100 && num > 0) {
            num *= 1000;
        }
        if (num > 50000) {
            if (!str.includes('.')) {
                num = num / 100;
            }
        }
        if (num > 50000) {
            num = num / 10;
        }
        return num;
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = OcrService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map