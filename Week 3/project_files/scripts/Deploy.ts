import { ethers } from 'ethers'
import { MyToken__factory, TokenizedBallot__factory } from '../typechain-types'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/Deploy.ts op1 op2 op3

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function deploy() {
    const proposals = process.argv.slice(2)

    console.log('Deploying MyToken contract')
    console.log('Proposals: ')

    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`)
    })
    console.log('---------------------------------')

    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    const balanceBN = await provider.getBalance(wallet.address)
    const balance = Number(ethers.formatUnits(balanceBN))
    console.log(`Wallet balance ${balance}`)
    if (balance < 0.01) {
        throw new Error('Not enough ether')
    }
    console.log('---------------------------------')

    const myTokenContractFactory = new MyToken__factory(wallet)
    const myTokenContract = await myTokenContractFactory.deploy()
    await myTokenContract.waitForDeployment()
    const myTokenContractAddress = await myTokenContract.getAddress()
    console.log(`MyToken contract deployed to address: ${myTokenContractAddress}`)
    console.log('---------------------------------')

    const ballotContractFactory = new TokenizedBallot__factory(wallet)

    const lastBlock = await provider.getBlock('latest')
    const lastBlockNumber = lastBlock?.number ?? 0
    console.log(`latest block number: ${lastBlockNumber}`)
    const ballotContract = await ballotContractFactory.deploy(
        proposals.map(ethers.encodeBytes32String),
        myTokenContractAddress,
        lastBlockNumber + 200000
    )
    await ballotContract.waitForDeployment()
    const ballotContractAddress = await ballotContract.getAddress()
    console.log(`TokenizedBallot contract deployed to address: ${ballotContractAddress}`)
    console.log('---------------------------------')

    for (let index = 0; index < proposals.length; index++) {
        const proposal = await ballotContract.proposals(index)
        const name = ethers.decodeBytes32String(proposal.name)
        console.log({ index, name, proposal })
    }
    console.log('---------------------------------')
}

deploy().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
