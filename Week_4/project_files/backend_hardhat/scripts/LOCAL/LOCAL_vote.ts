import { ethers } from 'hardhat'
import { _deploy } from './LOCAL_EXPORT_deploy'
import { _mint } from './LOCAL_EXPORT_mint'
import { _delegate } from './LOCAL_EXPORT_selfDelegate'

// yarn ts-node --files ./scripts/LOCAL_vote.ts
//////////////////////////////////////////////
// below is for use with process.argv[2]
// need to replace acc1.address with toAccount when calling delegate()
// yarn ts-node --files ./scripts/LOCAL_vote.ts <address>
//////////////////////////////////////////////

const PROPOSALS = ['passed-prop0', 'passed-prop1', 'passed-prop2']
const FULL_TOKEN = ethers.parseUnits('1')
const HALF_TOKEN = ethers.parseUnits('0.5')

async function delegate() {
    // const toAccount = process.argv[2]
    const [deployer, acc1, acc2] = await ethers.getSigners()

    let myTokenContractAddress: string
    let tokenizedBallotContractAddress: string
        // deploy contracts
    ;[myTokenContractAddress, tokenizedBallotContractAddress] = await _deploy(PROPOSALS, 0)
    // mint tokens to acc1
    await _mint(myTokenContractAddress)
    // acc1 self delegates
    await _delegate(myTokenContractAddress)

    const myTokenContract = await ethers.getContractAt('MyToken', myTokenContractAddress)
    const tokenizedBallotContract = await ethers.getContractAt(
        'TokenizedBallot',
        tokenizedBallotContractAddress
    )

    console.log(
        `acc1 has balance of ${(await myTokenContract.getVotes(acc1.address)).toString()} tokens`
    )

    console.log('---------------------------------')
    const addressess = [deployer.address, acc1.address, acc2.address]
    for (let index = 0; index < addressess.length; index++) {
        const powerSpent = await tokenizedBallotContract.votingPowerSpent(addressess[index])
        console.log(`${addressess[index]} has spent ${powerSpent.toString()} voting power`)
    }

    // Check Proposal Vote Counts
    console.log('---------------------------------')
    console.log('Vote counts before vote')
    for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await tokenizedBallotContract.proposals(index)
        console.log(
            `${ethers.decodeBytes32String(
                proposal.name
            )} has ${proposal.voteCount.toString()} votes`
        )
    }
    console.log('---------------------------------')

    // Vote
    console.log('casting vote...')
    const voteTx = await tokenizedBallotContract.connect(acc1).vote(0, 1)
    await voteTx.wait(2)

    // Check Proposal Vote Counts
    console.log('---------------------------------')
    console.log('Vote counts after vote')
    for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await tokenizedBallotContract.proposals(index)
        console.log(
            `${ethers.decodeBytes32String(
                proposal.name
            )} has ${proposal.voteCount.toString()} votes`
        )
    }
    console.log('---------------------------------')
}

delegate().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
