import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoggerController {
  @Get('download')
  @Roles(Role.ADMIN)
  async downloadLog(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    if (!startDate) {
      throw new BadRequestException('startDate parameter is required (YYYY-MM-DD)');
    }

    // Default endDate to startDate if not provided
    const effectiveEndDate = endDate || startDate;

    const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');

    if (!fs.existsSync(logFilePath)) {
      throw new BadRequestException('Log file not found');
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="logs-${startDate}-to-${effectiveEndDate}.log"`,
    );

    // Create read stream and filter
    const fileStream = fs.createReadStream(logFilePath);
    const readline = require('readline');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Check if line contains any date in the range
      // Logs are in JSON format with timestamp field
      try {
        const logEntry = JSON.parse(line);
        if (logEntry.timestamp) {
          const logDate = logEntry.timestamp.slice(0, 10); // YYYY-MM-DD
          if (logDate >= startDate && logDate <= effectiveEndDate) {
            res.write(line + '\n');
          }
        }
      } catch {
        // If not JSON, check if line contains the date string
        if (line.includes(startDate) || line.includes(effectiveEndDate)) {
          res.write(line + '\n');
        }
      }
    }

    res.end();
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async listLogs() {
    // Return the last 100 lines of combined.log with proper formatting
    const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');
    if (!fs.existsSync(logFilePath)) {
      // Return a sample log entry if no logs exist yet
      return [{
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log dosyası henüz oluşturulmadı. Sistem logları burada görüntülenecek.',
        context: 'System'
      }];
    }

    const content = fs.readFileSync(logFilePath, 'utf-8');
    if (!content.trim()) {
      return [{
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log dosyası boş. Loglar burada görüntülenecek.',
        context: 'System'
      }];
    }

    const lines = content.trim().split('\n');
    // Parse JSON lines and ensure proper format
    return lines
      .slice(-100)
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          // Ensure all required fields exist
          return {
            timestamp: parsed.timestamp || new Date().toISOString(),
            level: parsed.level || 'info',
            message: parsed.message || line,
            context: parsed.context || 'System'
          };
        } catch {
          // If not JSON, create a formatted log entry
          return {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: line,
            context: 'System'
          };
        }
      })
      .reverse();
  }
}
