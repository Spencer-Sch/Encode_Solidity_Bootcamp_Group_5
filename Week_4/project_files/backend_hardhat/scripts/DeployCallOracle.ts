import { ethers } from 'ethers'
import { CallOracle__factory } from '../typechain-types'
import * as dotenv from 'dotenv'
dotenv.config()

function setupProvider() {
    const provider = new ethers.AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY ?? '')
    return provider
}

async function main() {
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    console.log(`Using address ${wallet.address}`)
    const balanceBN = await provider.getBalance(wallet.address)
    const balance = Number(ethers.formatUnits(balanceBN))
    console.log(`Wallet balance ${balance}`)
    if (balance < 0.01) {
        throw new Error('Not enough ether')
    }
    console.log('Deploying CallOracle contract')
    const oracleFactory = new CallOracle__factory(wallet)
    const oracleContract = await oracleFactory.deploy('0x199839a4907ABeC8240D119B606C98c405Bb0B33')
    await oracleContract.waitForDeployment()
    const oracleContractAddress = await oracleContract.getAddress()
    console.log(`Contract deployed at address ${oracleContractAddress}`)
    const btcSpotPrice = await oracleContract.getBtcSpotPrice(60 * 60 * 24 * 90)
    console.log(`The last value for BTC Spot Price is ${btcSpotPrice}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
