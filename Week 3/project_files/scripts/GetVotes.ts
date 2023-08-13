import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/GetVotes.ts <address>

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function getVotes() {
    const toAddress = process.argv[2]

    const MyTokenContractAddress = process.env.MY_TOKEN_CONTRACT_ADDRESS ?? ''

    console.log('---------------------------------')

    // get user wallet
    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    const balanceBN = await provider.getBalance(wallet.address)
    const balance = Number(ethers.formatUnits(balanceBN))
    console.log(`Wallet balance ${balance}`)
    if (balance < 0.01) {
        throw new Error('Not enough ether')
    }

    // get deployed contract
    const myTokenContract = await ethers.getContractAt('MyToken', MyTokenContractAddress, wallet)

    console.log('---------------------------------')

    // Check Voting Power
    const votes = await myTokenContract.getVotes(toAddress)
    console.log(`Account ${toAddress} has ${votes.toString()} units of voting power\n`)

    console.log('---------------------------------')
}

getVotes().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
