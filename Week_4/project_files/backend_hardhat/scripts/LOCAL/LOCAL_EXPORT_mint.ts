import { ethers } from 'hardhat'

// NOTICE: This script is being used inside of LOCAL_delegate.ts to mint tokens to acc1.
// NOTICE: This script IS NOT meant to be used directly
const MINT_VALUE = ethers.parseUnits('1')

export async function _mint(myTokenContractAddress: string) {
    const [deployer, acc1] = await ethers.getSigners()

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
