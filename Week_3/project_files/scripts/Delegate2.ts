import { ethers } from 'hardhat'
import { MyToken__factory } from '../typechain-types'
import * as dotenv from 'dotenv'

dotenv.config()

async function delegate2() {
    // ******** Does not function ***********
    //   const MyTokenContractAddress = process.env.TEST_MY_TOKEN_CONTRACT_ADDRESS ?? ''
    //   //////////////////////////////////////
    //   // un-comment the line below to pass addresses as arguments to the terminal command
    //   //const voterAddresses = process.argv.slice(2)
    //   //
    //   // use command:
    //   // yarn ts-node --files ./scripts/Delegate2.ts <SOME WALLET HERE>
    //   //////////////////////////////////////
    //   function setupProvider() {
    //       const provider = new ethers.InfuraProvider("sepolia");
    //       return provider
    //     }
    //   // get user wallet
    //   const provider = setupProvider()
    //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    //   const signer = wallet.connect(provider);
    //   const balanceBN = await provider.getBalance(wallet.address)
    //   const balance = Number(ethers.formatUnits(balanceBN))
    //   console.log(`Wallet balance ${balance}`)
    //   if (balance < 0.01) {
    //       throw new Error('Not enough ether')
    //   }
    // const params = process.argv.slice(2)
    // const delegateeAddress = params[0];
    // const tokenizedBallotContractFactory = new MyToken__factory(signer);
    // const myTokenContract = await ethers.getContractAt('MyToken', MyTokenContractAddress, wallet)
    // console.log(`Delegating voting right from ${wallet.address} to
    // ${delegateeAddress}`);
    // await myTokenContract.connect(signer).delegate(`${wallet.address}`);
    // const votesBefore = await myTokenContract.getVotes(`${wallet.address}`);
    // console.log(`Voting power before delegating: ${votesBefore}`);
    // const delegateTx = await myTokenContract.delegate(delegateeAddress);
    // await delegateTx.wait();
    // const votesAfter = await myTokenContract.getVotes(`${wallet.address}`);
    // console.log(`Voting power after delegating: ${votesAfter}`);
}

delegate2().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
