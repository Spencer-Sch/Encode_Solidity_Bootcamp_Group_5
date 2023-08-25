import { AppService } from './app.service';
import { MintTokenBodyDto } from './dtos/mintToken.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    mintTokens(body: MintTokenBodyDto): Promise<{
        result: boolean;
        tx: string;
        to: string;
        from: string;
        gasUsed: string;
        error?: undefined;
    } | {
        result: boolean;
        error: any;
        tx?: undefined;
        to?: undefined;
        from?: undefined;
        gasUsed?: undefined;
    }>;
}
