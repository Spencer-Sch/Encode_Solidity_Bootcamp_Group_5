import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getAnotherThing(): string;
    getContractAdress(): {
        address: string;
    };
    getTotalSupply(): Promise<any>;
    getTokenBalance(address: string): Promise<any>;
    mintTokens(body: MintTokenDto): Promise<{
        result: boolean;
        tx: any;
    }>;
}
