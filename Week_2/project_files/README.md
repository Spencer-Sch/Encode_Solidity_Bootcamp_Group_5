# Weekend Project Notes

## Setup

- install dependencies <br>
`yarn install` <br>
or <br>
`npm install`

- run `yarn hardhat compile` to make sure everything is working
- or `npx hardhat compile` ...I think that's right for npm

## .env

- rename `.example.env` to `.env`
- add your wallet private key to the `.env`

## Project cmds

- Deploy `Ballot.sol` to sepolioa testnet <br>
`yarn ts-node --files ./scripts/DeployWithEthers.ts op1 op2 op3`
