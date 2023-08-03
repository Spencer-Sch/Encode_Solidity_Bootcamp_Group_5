import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat' // don't need to use hre object here becuase ethers from hardhat is already connected to the hre
import { Ballot } from '../typechain-types';
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { AddressLike } from 'ethers';

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3",]

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.encodeBytes32String(array[index]));
  }
  return bytes32Array;
}

async function deployContract() {
  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS) // array passed to contract constructor
  );
  await ballotContract.waitForDeployment();
  return ballotContract;
}

describe('Ballot', function () {
  describe('when the contract is deployed', async function () {
    let ballotContract: Ballot
    let accounts: HardhatEthersSigner[]
    let deployerAddress: AddressLike

    beforeEach(async function () {
      ballotContract = await loadFixture(deployContract);
      accounts = await ethers.getSigners()
      deployerAddress = accounts[0].address
    })

    it('has the provided proposals', async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.decodeBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    })
    it('has zero votes for all proposals', async function () {
      // forEach version
      // let proposals: Promise<[string, bigint] & {
      //     name: string;
      //     voteCount: bigint;
      // }>[] = []

      // PROPOSALS.forEach((value, index) => {
      //   proposals.push(ballotContract.proposals(index))
      // })
      // const result = await Promise.all(proposals)

      // result.forEach(item => {
      //   console.log(item.voteCount)
      //   expect(Number(item.voteCount)).to.equal(0)
      // })
      /////////////////////////////
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(
          0
        );
      }
    })
    it('sets the deployer address as chairperson', async function () {
      const chairperson = await ballotContract.chairperson()
      expect(chairperson).to.equal(deployerAddress)

    })
    it("sets the voting weight for the chairperson as 1", async () => {
      const chairpersonVoter = await ballotContract.voters(deployerAddress)
      expect(chairpersonVoter.weight).to.equal(1)
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
      it("gives right to vote for another address", async () => {
        // TODO
        throw Error("Not implemented");
      });
      it("can not give right to vote for someone that has voted", async () => {
        // TODO
        throw Error("Not implemented");
      });
      it("can not give right to vote for someone that has already voting rights", async () => {
        // TODO
        throw Error("Not implemented");
      });
    });

    describe("when the voter interacts with the vote function in the contract", async () => {
      // TODO
      it("should register the vote", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when the voter interacts with the delegate function in the contract", async () => {
      // TODO
      it("should transfer voting power", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
      // TODO
      it("should revert", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when an account without right to vote interacts with the vote function in the contract", async () => {
      // TODO
      it("should revert", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
      // TODO
      it("should revert", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
      // TODO
      it("should return 0", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
      // TODO
      it("should return 0", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when someone interacts with the winnerName function before any votes are cast", async () => {
      // TODO
      it("should return name of proposal 0", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
      // TODO
      it("should return name of proposal 0", async () => {
        throw Error("Not implemented");
      });
    });

    describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
      // TODO
      it("should return the name of the winner proposal", async () => {
        throw Error("Not implemented");
      });
    });
  }) 
})
