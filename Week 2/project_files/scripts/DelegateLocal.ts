import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

// command to execute script:
// yarn ts-node --files ./scripts/Delegate.ts <toAddress>

// command to spin up local node
// yarn hardhat node

async function delegateLocal() {
  const toAddress = process.argv[2];

  const accounts = await ethers.getSigners()
  const signer = accounts[0] // chairperson
  const voter = accounts[1]
  const voterAddress = await voter.getAddress()
  const delegateToAddress = "0x8f741CE8580ad892D875Ca590a5d83A27B24fb3b"

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

  // give right to vote to delegate account
  const giveRightToVotetx = await ballotContract.giveRightToVote(delegateToAddress)
  const giveRightToVoteRec = await giveRightToVotetx.wait(1)

  // give right to vote to voter
  const giveRightToVotetx2 = await ballotContract.giveRightToVote(voterAddress)
  const giveRightToVoteRec2 = await giveRightToVotetx2.wait(1)

  // call delegate
  const voterConnectedContract = await ballotContract.connect(voter)
  const delegatetx = await voterConnectedContract.delegate(toAddress)
  const delegateRec = await delegatetx.wait(1)

  console.log("voter", await ballotContract.voters(voterAddress))
  console.log("delegate", await ballotContract.voters(voterAddress))
}

delegateLocal().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});