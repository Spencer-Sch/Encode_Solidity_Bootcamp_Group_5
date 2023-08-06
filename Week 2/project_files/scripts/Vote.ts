import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();

// ABIs
import BallotArtifact from '../artifacts/contracts/Ballot.sol/Ballot.json' 

// Connect to a provider (e.g., Infura, or a local Ethereum node like Geth)
const provider = new ethers.InfuraProvider("sepolia");

const contractAddress = "0xF4c6d10D4568f6CD84FfEe1A28754388182EFA47";

function setupProvider() {
  // https://docs.ethers.org/v6/api/providers/
  // const provider = ethers.getDefaultProvider("sepolia")
  // https://docs.ethers.org/v6/api/providers/thirdparty/
  const provider = new ethers.InfuraProvider("sepolia");
  return provider
}

async function main() {

  const provider = setupProvider()
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const contractInstance = new ethers.Contract(contractAddress, BallotArtifact.abi, wallet);

  // Assuming vote is a transaction, you'll want to await it and possibly handle the receipt
  const tx = await contractInstance.vote(0);
  console.log("Transaction sent:", tx.hash);

  // Wait for it to be mined
  const receipt = await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
