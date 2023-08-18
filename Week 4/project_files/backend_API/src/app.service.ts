import { Injectable } from '@nestjs/common'
import * as tokenJson from './assets/MyToken.json'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()

const CONTRACT_ADDRESS = process.env.MY_TOKEN_CONTRACT_ADDRESS ?? ''

@Injectable()
export class AppService {
    contract: ethers.Contract
    provider: ethers.Provider
    wallet: ethers.Wallet
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '')
        // this.provider = new ethers.InfuraProvider('sepolia')
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider)
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, tokenJson.abi, this.wallet)
    }

    getHello(): string {
        return 'Hello World!'
    }

    getAnotherThing(): string {
        return 'Another thing'
    }

    getContractAddress(): { address: string } {
        return { address: CONTRACT_ADDRESS }
    }

    getTotalSupply() {
        return this.contract.totalSupply()
    }

    getTokenBalance(address: string) {
        return this.contract.balanceOf(address)
    }

    async mintTokens(address: string) {
        const tx = await this.contract.mint(address, 1n)
        const receipt = await tx.wait(2)
        return { result: true, tx: receipt.transactionHash //... }
    }
}
