import { ethers } from "hardhat";

async function main() {
  // receiving arguments from console call
  // slice out the first two items which are  references to local system files
  const proposals = process.argv.slice(2);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");

  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotFactory = await ethers.getContractFactory("Ballot");
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