import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractInstance = await ethers.getContractAt("Ballot", contractAddress);

  const winningProposal = await contractInstance.winningProposal();
  console.log("Winning Proposal:", winningProposal); //could do a map here if we wanted

  const winnerName = await contractInstance.winnerName();
  console.log("Winner Name:", winnerName); //

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
