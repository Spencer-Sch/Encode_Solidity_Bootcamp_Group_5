import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function getWinner() {
    const provider = setupProvider()

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    const balanceBN = await provider.getBalance(wallet.address)
    const balance = Number(ethers.formatUnits(balanceBN))
    console.log(`Wallet balance ${balance}`)
    if (balance < 0.01) {
        throw new Error('Not enough ether')
    }
    console.log('---------------------------------')

    // Get deployed contract
    const ballotContract = await ethers.getContractAt(
        'TokenizedBallot',
        process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? '',
        wallet
    )

    const winningProposalBytes32 = await ballotContract.winnerName()
    const winningProposalString = ethers.decodeBytes32String(winningProposalBytes32)
    console.log(`The winning proposal is: ${winningProposalString}`)
}

getWinner().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
