import { ethers } from "hardhat";

async function main() {
  const flavor = process.argv[2];

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractInstance = await ethers.getContractAt("Ballot", contractAddress);

  const voteTx = await contractInstance.vote(flavor)
  const voteRec = await voteTx.wait(1)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
