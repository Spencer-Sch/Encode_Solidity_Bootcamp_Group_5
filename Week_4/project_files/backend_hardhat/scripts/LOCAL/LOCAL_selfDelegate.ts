import { ethers } from 'hardhat'
import { _deploy } from './LOCAL_EXPORT_deploy'
import { _mint } from './LOCAL_EXPORT_mint'

// yarn ts-node --files ./scripts/LOCAL_selfDelegate.ts
//////////////////////////////////////////////
// below is for use with process.argv[2]
// need to replace acc1.address with toAccount when calling delegate()
// yarn ts-node --files ./scripts/LOCAL_selfDelegate.ts <address>
//////////////////////////////////////////////

const PROPOSALS = ['passed-prop0', 'passed-prop1', 'passed-prop2']

async function delegate() {
    // const toAccount = process.argv[2]
    const [deployer, acc1, acc2] = await ethers.getSigners()

    let myTokenContractAddress: string
        // deploy contracts
    ;[myTokenContractAddress] = await _deploy(PROPOSALS)
    // mint tokens to acc1
    await _mint(myTokenContractAddress)

    const myTokenContract = await ethers.getContractAt('MyToken', myTokenContractAddress)

    // Check Voting Power
    const votesBefore = await myTokenContract.getVotes(acc1.address)
    console.log(
        `Account ${
            acc1.address
        } has ${votesBefore.toString()} units of voting power before self delegating\n`
    )

    // Self delegate
    const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address)
    await delegateTx.wait()

    // Check voting power
    const votesAfter = await myTokenContract.getVotes(acc1.address)
    console.log(
        `Account ${
            acc1.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    )
}

delegate().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
