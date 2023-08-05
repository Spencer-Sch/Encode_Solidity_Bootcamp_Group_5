
import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

// command to execute script:
// yarn ts-node --files ./scripts/GiveRightToVoteLocal.ts <voterAddress> <voterAddress> <voterAddress>

async function giveRightToVoteLocal() {
  const voterAddresses = process.argv.slice(2);
  
  const accounts = await ethers.getSigners()
  const signer = accounts[0] // chairperson
  // const voter1 = accounts[1]
  // const voter2 = accounts[2]
  // const voterAddress = await voter.getAddress()
  // const voterAddresses = [voter1.address, voter2.address]

  const proposals = ["prop1", "prop2", "prop3"]
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotFactory = await ethers.getContractFactory("Ballot", signer);
  const ballotContract = await ballotFactory.deploy(
    proposals.map(ethers.encodeBytes32String)
  );
  await ballotContract.waitForDeployment();
  const address = await ballotContract.getAddress()
  console.log(`Contract deployed to address: ${address}`)
  
  // console.log("voterAddress: ", voterAddresses)

  for (let i = 0; i < voterAddresses.length; i++) {
    console.log(`give right to voter ${i}: ${voterAddresses[i]}`)
    // give right to vote to voter
    await ballotContract.giveRightToVote(voterAddresses[i])
  }

  for (let i = 0; i < voterAddresses.length; i++) {
    console.log(`voter ${i}: `, await ballotContract.voters(voterAddresses[i]))
  }
}

giveRightToVoteLocal().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});