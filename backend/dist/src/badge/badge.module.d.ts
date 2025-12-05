import { OnModuleInit } from '@nestjs/common';
import { BadgeService } from './badge.service';
export declare class BadgeModule implements OnModuleInit {
    private badgeService;
    private readonly logger;
    constructor(badgeService: BadgeService);
    onModuleInit(): Promise<void>;
}
