import { ethers } from 'hardhat';
import { expect } from 'chai';
import * as dotenv from 'dotenv';

dotenv.config();

describe('TokenizedBallot', function () {
  it('should return the winning proposal', async function () {
    // Deploy the contract
    const TokenizedBallot = await ethers.getContractFactory('TokenizedBallot');
    const tokenizedBallot = await TokenizedBallot.deploy();
    await tokenizedBallot.deployed();

    // Perform the vote
    const proposal1 = 'Proposal 1';
    const proposal2 = 'Proposal 2';
    const proposal3 = 'Proposal 3';

    await tokenizedBallot.vote(0, proposal1);
    await tokenizedBallot.vote(1, proposal2);
    await tokenizedBallot.vote(2, proposal3);

    // Get the winning proposal
    const winningProposal = await tokenizedBallot.getWinningProposal();
    const winningProposalName = await tokenizedBallot.proposals(winningProposal);

    // Assert the result
    expect(winningProposalName).to.equal(proposal1);
  });
});
