import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { TokenizedBallot } from '../typechain-types/contracts/TokenizedBallot.sol'
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol'
import { AddressLike } from 'ethers'

const PROPOSALS = ['prop0', 'prop1', 'prop2']
const PROP_0 = 0
const TARGET_BLOCK_NUMBER = 5
const MINT_VALUE = ethers.parseUnits('1')
const VOTE_AMOUNT = MINT_VALUE / 2n

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = []
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.encodeBytes32String(array[index]))
    }
    return bytes32Array
}

describe('TokenizedBallot', async () => {
    let myTokenContract: MyToken
    let myTokenContractAddress: AddressLike
    let tokenizedBallotContract: TokenizedBallot
    let tokenizedBallotContractAddress: AddressLike
    let deployer: HardhatEthersSigner
    let acc1: HardhatEthersSigner
    let acc2: HardhatEthersSigner

    async function deployContracts() {
        const ERC20VotesContractFactory = await ethers.getContractFactory('MyToken')
        const MyTokenContract_ = await ERC20VotesContractFactory.deploy()
        await MyTokenContract_.waitForDeployment()
        const MyTokenContractAddress_ = await MyTokenContract_.getAddress()

        const TokenizedBallotContractFactory = await ethers.getContractFactory('TokenizedBallot')
        const TokenizedBallotContract_ = await TokenizedBallotContractFactory.deploy(
            convertStringArrayToBytes32(PROPOSALS),
            MyTokenContractAddress_,
            TARGET_BLOCK_NUMBER
        )
        await TokenizedBallotContract_.waitForDeployment()
        const TokenizedBallotContractAddress_ = await TokenizedBallotContract_.getAddress()

        const MINTER_ROLE = await MyTokenContract_.MINTER_ROLE()
        const giveRoleTx = await MyTokenContract_.grantRole(
            MINTER_ROLE,
            await deployer.getAddress()
        )
        giveRoleTx.wait()

        return {
            MyTokenContract_,
            MyTokenContractAddress_,
            TokenizedBallotContract_,
            TokenizedBallotContractAddress_,
        }
    }
    beforeEach(async () => {
        ;[deployer, acc1, acc2] = await ethers.getSigners()
        const {
            MyTokenContract_,
            MyTokenContractAddress_,
            TokenizedBallotContract_,
            TokenizedBallotContractAddress_,
        } = await loadFixture(deployContracts)
        myTokenContract = MyTokenContract_
        myTokenContractAddress = MyTokenContractAddress_
        tokenizedBallotContract = TokenizedBallotContract_
        tokenizedBallotContractAddress = TokenizedBallotContractAddress_
    })

    describe('When a user with voting power votes', async () => {
        it('emits Vote event', async () => {
            // deployer mint and transfer tokens to acc1
            const mintTx = await myTokenContract.mint(acc1.address, MINT_VALUE)
            await mintTx.wait()
            // acc1 self delegates to vote
            const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address)
            delegateTx.wait()
            // expect acc1 vote to emit "Vote" event with matching args
            await expect(tokenizedBallotContract.connect(acc1).vote(PROP_0, VOTE_AMOUNT))
                .to.emit(tokenizedBallotContract, 'Vote')
                .withArgs(0, VOTE_AMOUNT.toString())
        })
    })
})
