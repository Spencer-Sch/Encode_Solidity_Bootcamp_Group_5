import { ethers } from 'hardhat'
import { _deploy } from './LOCAL_EXPORT_deploy'

// yarn ts-node --files ./scripts/LOCAL_mint.ts
//////////////////////////////////////////////
// below is for use with process.argv[2]
// need to replace acc1.address with toAccount when calling mint()
// yarn ts-node --files ./scripts/LOCAL_mint.ts op1 op2 op3
//////////////////////////////////////////////

const PROPOSALS = ['passed-prop0', 'passed-prop1', 'passed-prop2']
const MINT_VALUE = ethers.parseUnits('1')

async function mint() {
    // const toAccount = process.argv[2]
    const [deployer, acc1, acc2] = await ethers.getSigners()

    let myTokenContractAddress: string

    // deploy both contracts
    ;[myTokenContractAddress] = await _deploy(PROPOSALS)

    const myTokenContract = await ethers.getContractAt('MyToken', myTokenContractAddress)

    // get acc1 balance before mint
    const acc1BalanceBeforeBN = await myTokenContract.balanceOf(acc1.address)
    console.log(`Account ${acc1.address} blance before mint ${acc1BalanceBeforeBN.toString()}`)

    // mint tokens to acc1
    const mintTx = await myTokenContract.mint(acc1.address, MINT_VALUE)
    mintTx.wait()

    // get acc1 balance after mint
    const acc1BalanceAfterBN = await myTokenContract.balanceOf(acc1.address)
    console.log(`Account ${acc1.address} blance after mint ${acc1BalanceAfterBN.toString()}`)
}

mint().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
