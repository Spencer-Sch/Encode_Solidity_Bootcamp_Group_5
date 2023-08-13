import { ethers } from 'hardhat'

// NOTICE: This script is being used inside of LOCAL_delegate.ts to mint tokens to acc1.
// NOTICE: This script IS NOT meant to be used directly

export async function _delegate(myTokenContractAddress: string) {
    const [deployer, acc1, acc2] = await ethers.getSigners()

    const myTokenContract = await ethers.getContractAt('MyToken', myTokenContractAddress)

    // Check Voting Power
    const votesBefore = await myTokenContract.getVotes(acc1.address)
    console.log(
        `Account ${
            acc1.address
        } has ${votesBefore.toString()} units of voting power before self delegating\n`
    )

    // Self delegate
    console.log('delegating...')
    const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address)
    delegateTx.wait(2)

    // Check voting power
    const votesAfter = await myTokenContract.getVotes(acc1.address)
    console.log(
        `Account ${
            acc1.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    )
}

// _delegate().catch((error) => {
//     console.error(error)
//     process.exitCode = 1
// })
