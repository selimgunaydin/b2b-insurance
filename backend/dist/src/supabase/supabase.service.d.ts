import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private configService;
    private supabase;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;
}
