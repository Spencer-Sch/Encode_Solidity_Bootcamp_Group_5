import { Injectable } from '@nestjs/common'
import * as tokenJson from './assets/MyToken.json'
import { ContractTransactionReceipt, ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()

const CONTRACT_ADDRESS = process.env.MY_TOKEN_CONTRACT_ADDRESS ?? ''
const MINT_VALUE = ethers.parseUnits('1')

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

    // leave for future reference
    // getTokenBalance(address: string) {
    //     return this.contract.balanceOf(address)
    // }
    /////////////////////////

    async mintTokens(address: string) {
        try {
            const tx = await this.contract.mint(address, MINT_VALUE)
            const receipt: ContractTransactionReceipt = await tx.wait(2)
            console.log('receipt: ', receipt)
            return {
                result: true,
                tx: receipt.hash,
                to: receipt.to,
                from: receipt.from,
                gasUsed: receipt.gasUsed.toString(),
            }
            // return { result: true }
        } catch (err) {
            console.error(err)
            return { result: false, error: err }
        }
    }
}
