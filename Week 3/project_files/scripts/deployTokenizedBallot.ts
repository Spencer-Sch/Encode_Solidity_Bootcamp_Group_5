import { ethers } from 'hardhat'
import { TokenizedBallot__factory } from '../typechain-types'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/deployTokenizedBallot.ts historical-fiction self-help fantasy-worlds classic-literature

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function deployTokenizedBallot() {
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)

    console.log('Deploying TokenizedBallot contract')

    const proposals = process.argv.slice(2)
    const lastBlock = await provider.getBlock('latest')
    const lastBlockNumber = lastBlock?.number ?? 0

    const ballotContractFactory = new TokenizedBallot__factory(wallet)
    const ballotContract = await ballotContractFactory.deploy(
        proposals.map(ethers.encodeBytes32String),
        process.env.MY_TOKEN_CONTRACT_ADDRESS ?? '',
        lastBlockNumber + 100000
    )
    await ballotContract.waitForDeployment()

    const ballotContractAddress = await ballotContract.getAddress()
    console.log(`TokenizedBallot contract deployed to address: ${ballotContractAddress}`)

    console.log('Deployment completed successfully!')
}

deployTokenizedBallot()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
