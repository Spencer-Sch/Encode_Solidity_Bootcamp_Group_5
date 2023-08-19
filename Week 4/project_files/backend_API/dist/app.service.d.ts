import { ethers } from 'ethers';
export declare class AppService {
    contract: ethers.Contract;
    provider: ethers.Provider;
    wallet: ethers.Wallet;
    constructor();
    mintTokens(address: string): Promise<{
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
