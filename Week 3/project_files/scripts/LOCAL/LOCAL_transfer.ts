import { ethers } from 'hardhat'
import { _deploy } from './LOCAL_EXPORT_deploy'
import { _mint } from './LOCAL_EXPORT_mint'

// yarn ts-node --files ./scripts/LOCAL_transfer.ts
//////////////////////////////////////////////
// below is for use with process.argv[2]
// need to replace acc1.address with toAccount when calling delegate()
// yarn ts-node --files ./scripts/LOCAL_selfDelegate.ts <address>
//////////////////////////////////////////////

const PROPOSALS = ['passed-prop0', 'passed-prop1', 'passed-prop2']
const MINT_VALUE = ethers.parseUnits('1')

async function transfer() {
    // const toAccount = process.argv[2]
    const [deployer, acc1, acc2] = await ethers.getSigners()

    let myTokenContractAddress: string
        // deploy contracts
    ;[myTokenContractAddress] = await _deploy(PROPOSALS)
    // mint tokens to acc1
    await _mint(myTokenContractAddress)

    const myTokenContract = await ethers.getContractAt('MyToken', myTokenContractAddress)

    console.log('---------------------------------')

    // get acc1 balance before transfer
    const acc1BalanceBeforeBN = await myTokenContract.balanceOf(acc1.address)
    console.log(
        `Account ${acc1.address} balance before transfer ${acc1BalanceBeforeBN.toString()}`
    )
    // get acc2 balance before transfer
    const acc2BalanceBeforeBN = await myTokenContract.balanceOf(acc2.address)
    console.log(
        `Account ${acc2.address} balance before transfer ${acc2BalanceBeforeBN.toString()}`
    )

    // transfer tokens from acc1 to acc2
    const transferTx = await myTokenContract.connect(acc1).transfer(acc2.address, MINT_VALUE / 2n)
    await transferTx.wait()

    // get acc1 balance after transfer
    const acc1BalanceAfterBN = await myTokenContract.balanceOf(acc1.address)
    console.log(`Account ${acc1.address} balance after transfer ${acc1BalanceAfterBN.toString()}`)
    // get acc2 balance after transfer
    const acc2BalanceAfterBN = await myTokenContract.balanceOf(acc2.address)
    console.log(`Account ${acc2.address} balance after transfer ${acc2BalanceAfterBN.toString()}`)

    console.log('---------------------------------')
}

transfer().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
