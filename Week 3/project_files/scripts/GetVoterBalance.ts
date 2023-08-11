import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
dotenv.config()

function setupProvider() {
    const provider = new ethers.InfuraProvider('sepolia')
    return provider
}

async function getVoterBalance() {
    const MyTokenContractAddress = process.env.TEST_MY_TOKEN_CONTRACT_ADDRESS ?? ''
    // const MyTokenContractAddress = "hardcode contract address here"

    //////////////////////////////////////
    // option 1
    // un-comment one line below if you want to pass addresses as arguments to the terminal command
    const voterAddresses = process.argv.slice(2)
    //
    // use command:
    // yarn ts-node --files ./scripts/GetVoterBalance.ts0x6F118Fe8Dd5DD12A4c6ff9359750c503a2dF667C 0x09FA6695dD0338FF8e9E1b2c3209fFf2161D9034 0x5A513334f88ECFdD46EC25E336f9cBf52E52887C 0xD04AD68A92F3C724a274789a4F13A92b01286A40 0xb54Bc3B7735de07c0c91DD595Eb0B2Cf9e8f37D6 0x8f741CE8580ad892D875Ca590a5d83A27B24fb3b 0xb5b06eABE206b3D9Aa96229341e2e775520C3D27
    //////////////////////////////////////

    //////////////////////////////////////
    // option 2
    // un-comment array below to check balace for all group members
    // const voterAddresses = [
    //   "0x6F118Fe8Dd5DD12A4c6ff9359750c503a2dF667C",
    //   "0x09FA6695dD0338FF8e9E1b2c3209fFf2161D9034",
    //   "0x5A513334f88ECFdD46EC25E336f9cBf52E52887C",
    //   "0xD04AD68A92F3C724a274789a4F13A92b01286A40",
    //   "0xb54Bc3B7735de07c0c91DD595Eb0B2Cf9e8f37D6",
    //   "0x8f741CE8580ad892D875Ca590a5d83A27B24fb3b",
    //   "0xb5b06eABE206b3D9Aa96229341e2e775520C3D27",
    // ]
    //
    // use command:
    // yarn ts-node --files ./scripts/GetVoterBalance.ts
    //////////////////////////////////////

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

    for (let i = 0; i < voterAddresses.length; i++) {
        // confirm each voter exists in the voters mapping
        console.log(
            `${voterAddresses[i]} balance: `,
            (await myTokenContract.balanceOf(voterAddresses[i])).toString()
        )
    }
}

getVoterBalance().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
