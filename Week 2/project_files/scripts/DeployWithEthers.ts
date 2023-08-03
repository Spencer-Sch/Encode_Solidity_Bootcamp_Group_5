import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

function setupProvider() {
  // https://docs.ethers.org/v6/api/providers/
  // const provider = ethers.getDefaultProvider("sepolia")
  // https://docs.ethers.org/v6/api/providers/thirdparty/
  const provider = new ethers.InfuraProvider("sepolia");
  return provider
}

async function main() {
  const proposals = process.argv.slice(2);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");

  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const provider = setupProvider()
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  
  // https://docs.ethers.org/v6/api/contract/#ContractFactory
  const ballotFactory = new Ballot__factory(wallet)
  const ballotContract = await ballotFactory.deploy(
    proposals.map(ethers.encodeBytes32String)
  );
  await ballotContract.waitForDeployment();
  const address = await ballotContract.getAddress()
  console.log(`Contract deployed to address: ${address}`)

  for (let index = 0; index < proposals.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const name = ethers.decodeBytes32String(proposal.name);
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});