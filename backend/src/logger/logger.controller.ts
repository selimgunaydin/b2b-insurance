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
  async downloadLog(@Query('date') date: string, @Res() res: Response) {
    if (!date) {
      throw new BadRequestException('Date parameter is required (YYYY-MM-DD)');
    }

    // Winston usually rotates files or we can just read the combined.log if date is today
    // Or if we strictly follow the plan: "logs/YYYY-MM-DD.log"
    // Since I configured "combined.log" and "error.log" in the previous step, I should ideally use daily rotation.
    // However, for simplicity given the previous config, let's just allow downloading the main files for now,
    // OR reconfigure LoggerModule to use DailyRotateFile.

    // Let's assume for this MVP we download the 'combined.log' or 'error.log'
    // But the user requested "loglar tarih seçilerek indirilebilmeli".
    // I should probably switch to winston-daily-rotate-file for better date support, but I can't install it easily now without another user interaction loop if I strictly follow "no new deps".
    // Wait, I installed `winston` and `nest-winston`. `winston-daily-rotate-file` is separate.
    // If I didn't install it, I can't use it.

    // Alternative: Just serve the `combined.log` for today, or scan the logs directory if I had setup rotation.
    // Given I set up `combined.log` as a static file, date filtering on download is tricky without parsing the file.

    // PLAN B: Parse `combined.log` and stream only lines matching the date.

    const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');

    if (!fs.existsSync(logFilePath)) {
      throw new BadRequestException('Log file not found');
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="logs-${date}.log"`,
    );

    // Create read stream and filter
    const fileStream = fs.createReadStream(logFilePath);
    const readline = require('readline');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Assume log format contains timestamp or is JSON.
      // My config was: winston.format.timestamp() + winston.format.json()
      // Line ex: {"level":"info","message":"...","timestamp":"2023-12-05T..."}
      if (line.includes(date)) {
        res.write(line + '\n');
      }
    }

    res.end();
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async listLogs() {
    // Just return the last 100 lines of combined.log for quick view
    const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');
    if (!fs.existsSync(logFilePath)) return [];

    const content = fs.readFileSync(logFilePath, 'utf-8');
    const lines = content.trim().split('\n');
    // Parse JSON lines
    return lines
      .slice(-100)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { message: line };
        }
      })
      .reverse();
  }
}
