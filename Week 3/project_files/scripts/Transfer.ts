import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

// yarn ts-node --files ./scripts/Transfer.ts <toAddress> <amountStr>

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function delegate() {
    const toAddress = process.argv[2]
    const amountStr = process.argv[3]

    let amountBN: bigint
    switch (amountStr) {
        case '1':
        case 'one':
            amountBN = ethers.parseUnits('1')
            break
        case '2':
        case 'two':
            amountBN = ethers.parseUnits('2')
            break
        case '3':
        case 'three':
            amountBN = ethers.parseUnits('3')
            break
        case '0.5':
        case '.5':
        case 'half':
        case '1/2':
            amountBN = ethers.parseUnits('0.5')
            break
        default:
            amountBN = ethers.parseUnits('1')
    }

    const MyTokenContractAddress =
        process.env.MY_TOKEN_CONTRACT_ADDRESS ?? process.env.TEST_MY_TOKEN_CONTRACT_ADDRESS ?? ''

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

    // Check Voting Power Before
    const votesFromAccBefore = await myTokenContract.getVotes(wallet.address)
    console.log(
        `Account ${
            wallet.address
        } has ${votesFromAccBefore.toString()} units of voting power before transfer\n`
    )
    const votesToAccBefore = await myTokenContract.getVotes(toAddress)
    console.log(
        `Account ${toAddress} has ${votesToAccBefore.toString()} units of voting power before transfer\n`
    )

    console.log('transfering...')
    // call transfer from caller to toAddress
    const transferTx = await myTokenContract.transfer(toAddress, amountBN)
    await transferTx.wait(2)

    // Check Voting Power After
    const votesFromAccAfter = await myTokenContract.getVotes(wallet.address)
    console.log(
        `Account ${
            wallet.address
        } has ${votesFromAccAfter.toString()} units of voting power after transfer\n`
    )
    const votesToAccAfter = await myTokenContract.getVotes(toAddress)
    console.log(
        `Account ${toAddress} has ${votesToAccAfter.toString()} units of voting power after transfer\n`
    )
    console.log('---------------------------------')
}

delegate().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
