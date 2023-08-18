import { ethers } from 'ethers';
export declare class AppService {
    contract: ethers.Contract;
    provider: ethers.Provider;
    wallet: ethers.Wallet;
    constructor();
    getHello(): string;
    getAnotherThing(): string;
    getContractAddress(): {
        address: string;
    };
    getTotalSupply(): Promise<any>;
    getTokenBalance(address: string): Promise<any>;
    mintTokens(address: string): Promise<{
        result: boolean;
        tx: any;
    }>;
}
