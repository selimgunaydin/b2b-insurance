import { Injectable, Logger } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as Levenshtein from 'fast-levenshtein';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  constructor(private prisma: PrismaService) {}

  async processImage(filePath: string) {
    const buffer = fs.readFileSync(filePath);
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, 'eng+tur');

    return this.extract(text);
  }

  async extract(text: string) {
    // Fetch companies from DB
    const dbCompanies = await this.prisma.insuranceCompany.findMany({
      where: { isActive: true },
    });
    this.logger.debug(
      `Loaded ${dbCompanies.length} companies from DB: ${dbCompanies.map((c) => c.name).join(', ')}`,
    );

    const lines = text.split('\n').map((l) => l.trim());
    this.logger.debug(`Extracted ${lines.length} lines from text`);
    const results: { company: string; price: number }[] = [];

    // Known bad OCR patterns -> Correct Company Name (partial or full)
    const specialMappings: Record<string, string> = {
      'h hoi': 'HDI SİGORTA',
      hdi: 'HDI SİGORTA',
      'h d i': 'HDI SİGORTA',
      'h.d.i': 'HDI SİGORTA',
      mapfre: 'MAPFRE SİGORTA',
      sompo: 'SOMPO SİGORTA',
      'H Hoi': 'HDI SİGORTA',
    };

    for (const line of lines) {
      if (!line) continue;

      let bestMatchCompany = null;
      let minDistance = Infinity;
      const lowerLine = line.toLowerCase();

      // 0. Special Mappings Check
      for (const [key, value] of Object.entries(specialMappings)) {
        if (lowerLine.includes(key)) {
          // Find the actual DB company that matches this mapped value
          const dbMatch = dbCompanies.find(
            (c) =>
              c.name.toLowerCase().includes(value.toLowerCase()) ||
              value.toLowerCase().includes(c.name.toLowerCase()),
          );
          if (dbMatch) {
            bestMatchCompany = dbMatch.name;
            break;
          }
        }
      }

      // 1. Exact/Substring Match
      if (!bestMatchCompany) {
        for (const dbCompany of dbCompanies) {
          if (lowerLine.includes(dbCompany.name.toLowerCase())) {
            bestMatchCompany = dbCompany.name;
            break;
          }
        }
      }

      // 2. Fuzzy Match if no exact match
      if (!bestMatchCompany) {
        for (const dbCompany of dbCompanies) {
          // Compare prefix of line with company name
          // Relaxed threshold: 40% of length or max 5 chars
          const targetLen = dbCompany.name.length;
          const compareStr = lowerLine.slice(0, targetLen + 3); // Take a bit more

          const distance = Levenshtein.get(
            compareStr,
            dbCompany.name.toLowerCase(),
          );

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

    // Deduplicate by company name, keeping the one with a valid price (or last found)
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

  private extractCorrectPrice(line: string): number | null {
    const numericRegex = /(\d[\d.,]+)/g;
    const matches = [...line.matchAll(numericRegex)].map((m) => m[1]);

    if (matches.length === 0) return null;

    const candidates = matches.map((val) => this.normalizePrice(val));

    // Filter out 0 or crazy values
    const validCandidates = candidates.filter((c) => c > 0 && c < 1000000);

    if (validCandidates.length === 0) return null;

    // Log candidates for debugging
    this.logger.debug(
      `Line: "${line}" -> Candidates: ${JSON.stringify(validCandidates)}`,
    );

    // Strategy:
    // 1. Prefer numbers with decimal parts (not integers) if they exist.
    //    (Premiums usually have cents, coverages often don't)
    const withDecimals = validCandidates.filter((c) => c % 1 !== 0);

    if (withDecimals.length > 0) {
      // If multiple, take the max? Or the one appearing last?
      // Usually max premium is the main one.
      return Math.max(...withDecimals);
    }

    // If only integers, take the max
    return Math.max(...validCandidates);
  }

  private normalizePrice(input: string): number {
    let str = input.trim();

    str = str.replace(/[^\d.,]/g, '');

    const lastDot = str.lastIndexOf('.');
    const lastComma = str.lastIndexOf(',');
    if (lastDot !== -1 && lastComma !== -1) {
      if (lastComma > lastDot) {
        str = str.replace(/\./g, '');
        str = str.replace(',', '.');
      } else {
        str = str.replace(/,/g, '');
      }
    } else if (lastComma !== -1) {
      if (str.split(',').length > 2) {
        str = str.replace(/,/g, '');
      } else {
        const parts = str.split(',');
        if (parts[1].length === 2) {
          str = str.replace(',', '.');
        } else {
          str = str.replace(',', '');
        }
      }
    } else if (lastDot !== -1) {
      if (str.split('.').length > 2) {
        str = str.replace(/\./g, '');
      } else {
        const parts = str.split('.');
        if (parts[1].length === 2) {
          // do nothing
        } else if (parts[1].length === 3) {
          str = str.replace(/\./g, '');
        }
      }
    }

    let num = parseFloat(str);
    if (isNaN(num)) return 0;

    if (num < 100 && num > 0) {
      num *= 1000;
    }

    // Fix huge numbers (e.g. 949844 -> 9498.44)
    if (num > 50000) {
      if (!str.includes('.')) {
        num = num / 100;
      }
    }

    // Fix specific OCR error where number is 10x inflated (e.g. 218289.85 -> 21828.98)
    // This happens when the first decimal digit is read as the last integer digit.
    // We assume prices for this insurance type are typically < 50,000 TL.
    // If we see > 50,000, it's likely this error.
    if (num > 50000) {
      num = num / 10;
    }

    return num;
  }
}
