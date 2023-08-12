import { ethers } from "hardhat";
import {MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv'

dotenv.config()

async function delegate() {

    const MyTokenContractAddress = process.env.TEST_MY_TOKEN_CONTRACT_ADDRESS ?? ''

    //////////////////////////////////////
    // un-comment the line below to pass addresses as arguments to the terminal command
    //const voterAddresses = process.argv.slice(2)
    //
    // use command:
    // yarn ts-node --files ./scripts/Delegate2.ts <SOME WALLET HERE>
    //////////////////////////////////////

    function setupProvider() {
        const provider = new ethers.InfuraProvider("sepolia");
        return provider
      }

    // get user wallet
    const provider = setupProvider()
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
    const signer = wallet.connect(provider);
    const balanceBN = await provider.getBalance(wallet.address)
    const balance = Number(ethers.formatUnits(balanceBN))
    console.log(`Wallet balance ${balance}`)
    if (balance < 0.01) {
        throw new Error('Not enough ether')
    }

  const params = process.argv.slice(2)
  const delegateeAddress = params[0];

  const tokenizedBallotContractFactory = new MyToken__factory(signer);
  const myTokenContract = await ethers.getContractAt('MyToken', MyTokenContractAddress, wallet)
   
  console.log(`Delegating voting right from ${wallet.address} to
  ${delegateeAddress}`);

  await myTokenContract.connect(signer).delegate(`${wallet.address}`);

  const votesBefore = await myTokenContract.getVotes(`${wallet.address}`);
  console.log(`Voting power before delegating: ${votesBefore}`);

  const delegateTx = await myTokenContract.delegate(delegateeAddress);
  await delegateTx.wait();

  const votesAfter = await myTokenContract.getVotes(`${wallet.address}`);
  console.log(`Voting power after delegating: ${votesAfter}`);




  /* 
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const args = process.argv;
  const params = args.slice(2);
  const contractAddress = params[0];
  const delegateeAddress = params[1];
  if (contractAddress === undefined || contractAddress === '') {
    throw "make sure CONTRACT address is set in the .env file";
  }

  console.log(`Attaching GTET token to contract`);
  let tokenizedBallotContract: GroupTenToken;
  const tokenizedBallotContractFactory = new GroupTenToken__factory(signer);
  tokenizedBallotContract = tokenizedBallotContractFactory.attach(contractAddress);

  console.log(`Delegating voting right from ${signer.address} to
              ${delegateeAddress}`);
  const delegateTx = await tokenizedBallotContract.delegate(delegateeAddress);
  await delegateTx.wait();
  const votePower = await tokenizedBallotContract.getVotes(delegateeAddress);
  console.log(
    `Voting delegated\n
    from: ${signer.address}\n
    to: ${delegateeAddress}\n
    with voting power of ${votePower}`
  );
 */
}

delegate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
