import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

// command to execute script:
// yarn ts-node --files ./scripts/Delegate.ts <toAddress>

function setupProvider() {
  const provider = new ethers.InfuraProvider("sepolia");
  return provider
}

async function delegate() {
  const toAddress = process.argv[2];
  // get contract address
  const ballotAddress = "0xF4c6d10D4568f6CD84FfEe1A28754388182EFA47"

  // get user wallet
  const provider = setupProvider()
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  // get deployed contract
  const ballotContract = await ethers.getContractAt("Ballot", ballotAddress, wallet)

  // call getRightToVote
  const tx = await ballotContract.delegate(toAddress)
  console.log(tx)
}

delegate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});