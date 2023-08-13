import { ethers } from 'hardhat'

// yarn ts-node --files ./scripts/LOCAL_deploy.ts op1 op2 op3

async function deploy() {
    const proposals = process.argv.slice(2)

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
        lastBlockNumber + 100000 // ???
    )
    await ballotContract.waitForDeployment()
    const ballotContractAddress = await ballotContract.getAddress()

    console.log(`TokenizedBallot contract deployed at address: ${ballotContractAddress}`)

    console.log('---------------------------------')
}

deploy().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
