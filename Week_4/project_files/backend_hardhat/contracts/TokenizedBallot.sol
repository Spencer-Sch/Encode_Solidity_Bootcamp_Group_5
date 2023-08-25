// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

/// @title Voting with ERC20 Tokens
contract TokenizedBallot {
    struct Proposal {
        bytes32 name; // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    /// @dev Voting logs to be displayed in frontend
    struct VoteLog {
        uint256 proposal;
        address voter;
        uint256 amount;
        uint256 blockNumber;
    }

    Proposal[] public proposals;
    VoteLog[] public votes;
    IMyToken public tokenContract;
    uint256 public targetBlockNumber;
    mapping(address => uint256) public votingPowerSpent;

    // Events
    event Vote(uint indexed proposal, uint indexed amount);

    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint _proposal, uint amount) external {
        require(
            votingPower(msg.sender) >= amount,
            'TokenizedBallot: trying to vote more than allowed'
        );
        votingPowerSpent[msg.sender] += amount;
        proposals[_proposal].voteCount += amount;
        votes.push(
            VoteLog({
                proposal: _proposal,
                voter: msg.sender,
                amount: amount,
                blockNumber: block.number
            })
        );
        emit Vote(_proposal, amount);
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber) - votingPowerSpent[account];
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
