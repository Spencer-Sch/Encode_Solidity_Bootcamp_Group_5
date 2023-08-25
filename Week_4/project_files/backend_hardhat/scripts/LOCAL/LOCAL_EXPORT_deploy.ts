import { ethers } from 'hardhat'

// NOTICE: This script is being used inside of LOCAL_mint.ts to deploy contracts before minting.
// NOTICE: This script IS NOT meant to be used directly
export async function _deploy(proposalsArg: string[], blockNumberExtra = 100000) {
    let proposals = proposalsArg

    console.log('Deploying MyToken contract')
    const myTokenFactory = await ethers.getContractFactory('MyToken')
    const myTokenContract = await myTokenFactory.deploy()
    await myTokenContract.waitForDeployment()
    const myTokenContractAddress = await myTokenContract.getAddress()

    console.log(`MyToken contract deployed at address: ${myTokenContractAddress}`)

    console.log('---------------------------------')

    console.log('Deploying TokenizedBallot contract')
    console.log('Proposals: ')

    proposals.forEach((el, i) => {
        console.log(`Proposal N. ${i + 1}: ${el}`)
    })
    console.log('---------------------------------')

    const ballotFactory = await ethers.getContractFactory('TokenizedBallot')
    const lastBlock = await ethers.provider.getBlock('latest')
    const lastBlockNumber = lastBlock?.number ?? 0
    const ballotContract = await ballotFactory.deploy(
        proposals.map(ethers.encodeBytes32String),
        myTokenContractAddress,
        lastBlockNumber + blockNumberExtra // ???
    )
    await ballotContract.waitForDeployment()
    const ballotContractAddress = await ballotContract.getAddress()

    console.log(`TokenizedBallot contract deployed at address: ${ballotContractAddress}`)

    console.log('---------------------------------')
    return [myTokenContractAddress, ballotContractAddress]
}
