import { ethers } from 'hardhat'
import { MyToken__factory } from '../typechain-types'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/deployMyToken.ts

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function deployMyToken() {
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)

    console.log('Deploying MyToken contract')
    const myTokenContractFactory = new MyToken__factory(wallet)
    const myTokenContract = await myTokenContractFactory.deploy()
    await myTokenContract.waitForDeployment()

    const myTokenContractAddress = await myTokenContract.getAddress()
    console.log(`MyToken contract deployed to address: ${myTokenContractAddress}`)

    console.log('Deployment completed successfully!')
}

deployMyToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
