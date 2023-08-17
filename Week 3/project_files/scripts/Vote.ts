import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/Vote.ts <prop index> <vote amount>

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function vote() {
    const [proposalIdx, amountStr] = process.argv.slice(2)

    let amountBN: bigint
    switch (amountStr) {
        case '1':
        case 'one':
            amountBN = ethers.parseUnits('1')
            break
        // case '2':
        // case 'two':
        //     amountBN = ethers.parseUnits('2')
        //     break
        // case '3':
        // case 'three':
        //     amountBN = ethers.parseUnits('3')
        //     break
        case '0.5':
        case '.5':
        case 'half':
        case '1/2':
            amountBN = ethers.parseUnits('0.5')
            break
        default:
            amountBN = ethers.parseUnits('1')
    }

    const tokenizedBallotContractAddress = process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS ?? ''

    console.log('-'.repeat(process.stdout.columns))

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
    const tokenizedBallotContract = await ethers.getContractAt(
        'TokenizedBallot',
        tokenizedBallotContractAddress,
        wallet
    )

    // Check Proposal Vote Counts Before
    console.log('-'.repeat(process.stdout.columns))
    console.log('Vote counts before vote')
    for (let index = 0; index < 4; index++) {
        const proposal = await tokenizedBallotContract.proposals(index)
        console.log(
            `${ethers.decodeBytes32String(
                proposal.name
            )} has ${proposal.voteCount.toString()} votes`
        )
    }

    console.log('voting...')
    // Cast Vote
    const voteTx = await tokenizedBallotContract.vote(Number(proposalIdx), amountBN)
    await voteTx.wait(2)

    // Check Proposal Vote Counts After
    console.log('-'.repeat(process.stdout.columns))
    console.log('Vote counts after vote')
    for (let index = 0; index < 4; index++) {
        const proposal = await tokenizedBallotContract.proposals(index)
        console.log(
            `${ethers.decodeBytes32String(
                proposal.name
            )} has ${proposal.voteCount.toString()} votes`
        )
    }
    console.log('-'.repeat(process.stdout.columns))
}

vote().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
