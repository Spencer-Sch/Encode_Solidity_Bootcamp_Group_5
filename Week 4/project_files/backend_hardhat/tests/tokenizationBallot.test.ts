import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { TokenizedBallot } from '../typechain-types/contracts/TokenizedBallot.sol'
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol'
import { AddressLike, Block, BlockTag, ContractTransactionResponse } from 'ethers'

const PROPOSALS = ['prop0', 'prop1', 'prop2']
const PROP_0 = 0
const PROP_1 = 1
// const TARGET_BLOCK_NUMBER = 5
// const TARGET_BLOCK_NUMBER = 0
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
    let currentBlock: number

    async function deployMyToken() {
        const ERC20VotesContractFactory = await ethers.getContractFactory('MyToken')
        const MyTokenContract_ = await ERC20VotesContractFactory.deploy()
        await MyTokenContract_.waitForDeployment()
        const MyTokenContractAddress_ = await MyTokenContract_.getAddress()

        // const TokenizedBallotContractFactory = await ethers.getContractFactory('TokenizedBallot')
        // const TokenizedBallotContract_ = await TokenizedBallotContractFactory.deploy(
        //     convertStringArrayToBytes32(PROPOSALS),
        //     MyTokenContractAddress_,
        //     TARGET_BLOCK_NUMBER
        // )
        // await TokenizedBallotContract_.waitForDeployment()
        // const TokenizedBallotContractAddress_ = await TokenizedBallotContract_.getAddress()

        // const MINTER_ROLE = await MyTokenContract_.MINTER_ROLE()
        // const giveRoleTx = await MyTokenContract_.grantRole(
        //     MINTER_ROLE,
        //     await deployer.getAddress()
        // )
        // giveRoleTx.wait()

        return {
            MyTokenContract_,
            MyTokenContractAddress_,
            // TokenizedBallotContract_,
            // TokenizedBallotContractAddress_,
        }
    }
    async function deployBallot() {
        // const ERC20VotesContractFactory = await ethers.getContractFactory('MyToken')
        // const MyTokenContract_ = await ERC20VotesContractFactory.deploy()
        // await MyTokenContract_.waitForDeployment()
        // const MyTokenContractAddress_ = await MyTokenContract_.getAddress()

        const TokenizedBallotContractFactory = await ethers.getContractFactory('TokenizedBallot')
        const TokenizedBallotContract_ = await TokenizedBallotContractFactory.deploy(
            convertStringArrayToBytes32(PROPOSALS),
            myTokenContractAddress,
            currentBlock
        )
        await TokenizedBallotContract_.waitForDeployment()
        const TokenizedBallotContractAddress_ = await TokenizedBallotContract_.getAddress()

        // const MINTER_ROLE = await MyTokenContract_.MINTER_ROLE()
        // const giveRoleTx = await MyTokenContract_.grantRole(
        //     MINTER_ROLE,
        //     await deployer.getAddress()
        // )
        // giveRoleTx.wait()

        return {
            // MyTokenContract_,
            // MyTokenContractAddress_,
            TokenizedBallotContract_,
            TokenizedBallotContractAddress_,
        }
    }
    beforeEach(async () => {
        ;[deployer, acc1, acc2] = await ethers.getSigners()
        const {
            MyTokenContract_,
            MyTokenContractAddress_,
            // TokenizedBallotContract_,
            // TokenizedBallotContractAddress_,
        } = await loadFixture(deployMyToken)
        myTokenContract = MyTokenContract_
        myTokenContractAddress = MyTokenContractAddress_
        // tokenizedBallotContract = TokenizedBallotContract_
        // tokenizedBallotContractAddress = TokenizedBallotContractAddress_
    })

    describe('When a user with voting power votes', async () => {
        it('emits Vote event', async () => {
            // deployer mint and transfer tokens to acc1
            const mintTx = await myTokenContract.mint(acc1.address, MINT_VALUE)
            await mintTx.wait()
            // acc1 self delegates to vote
            const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address)
            const txReceipt = await delegateTx.wait()
            // get block number
            currentBlock = txReceipt.blockNumber
            // deploy Ballot
            const { TokenizedBallotContract_, TokenizedBallotContractAddress_ } =
                await loadFixture(deployBallot)
            tokenizedBallotContract = TokenizedBallotContract_
            tokenizedBallotContractAddress = TokenizedBallotContractAddress_
            // expect acc1 vote to emit "Vote" event with matching args
            await expect(tokenizedBallotContract.connect(acc1).vote(PROP_0, VOTE_AMOUNT))
                .to.emit(tokenizedBallotContract, 'Vote')
                .withArgs(0, VOTE_AMOUNT.toString())
        })

        it.only('adds a VoteLog to the votes array', async () => {
            // deployer mint and transfer tokens to acc1
            const mintTx = await myTokenContract.mint(acc1.address, MINT_VALUE)
            await mintTx.wait()
            // acc1 self delegates to vote
            const delegateTx = await myTokenContract.connect(acc1).delegate(acc1.address)
            const txReceipt = await delegateTx.wait()
            // deployer mint and transfer tokens to acc2
            const mint2Tx = await myTokenContract.mint(acc2.address, MINT_VALUE)
            await mint2Tx.wait()
            // acc2 self delegates to vote
            const delegate2Tx = await myTokenContract.connect(acc2).delegate(acc2.address)
            const txReceipt2 = await delegate2Tx.wait()
            // get block number
            currentBlock = txReceipt.blockNumber
            // deploy Ballot
            const { TokenizedBallotContract_, TokenizedBallotContractAddress_ } =
                await loadFixture(deployBallot)
            tokenizedBallotContract = TokenizedBallotContract_
            tokenizedBallotContractAddress = TokenizedBallotContractAddress_
            // acc1 casts vote for prop 0
            const voteTx = await tokenizedBallotContract.connect(acc1).vote(PROP_0, VOTE_AMOUNT)
            await voteTx.wait()
            // acc2 casts vote for prop 1
            // const vote2Tx = await tokenizedBallotContract.connect(acc2).vote(PROP_1, VOTE_AMOUNT)
            // await vote2Tx.wait()

            console.log(await tokenizedBallotContract.votes.length)

            // let loop = true
            // for (let i = 0; (loop = true); i++) {
            //     const res = await tokenizedBallotContract.votes()
            //     console.log('res:', res)
            //     if (!res.voter) {
            //         loop = false
            //     }
            // }
        })
    })
})
