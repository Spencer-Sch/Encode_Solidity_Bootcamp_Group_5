import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractInstance = await ethers.getContractAt("Ballot", contractAddress);
  contractInstance.vote(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
