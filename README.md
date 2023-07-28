The following instructions outline the necessary steps needed in order to complete the homework assignment for Week1.

Goals:

- Deploy a single copy of HelloWorld.sol to a testnet and have each member of the team interact with the contract.
- Each interaction with HelloWorld.sol should be recorded in our team report

Recources:

Sepolia ETH faucet: https://sepoliafaucet.com/

- Each member will require some Sepolia test ETH in order to pay for gas fees

Project Steps:

1. One member of the group deploys HelloWorld.sol using Remix
    1. “Environment” in the Remix deploy side-bar should be set to “Injected Provider - MetaMask”
    2. The deploying member should have their MetaMask connected to Remix and set to the Sepolia test network
    3. Hit “Deploy” button
    4. Once the transaction is complete, save the address of the contract to the report
2. Each member of the group should deploy their own Greeter.sol using Remix
    1. “Environment” in the Remix deploy side-bar should be set to “Injected Provider - MetaMask”
    2. Your MetaMask should be connected to Remix and set to the Sepolia test network
    3. “Contract” in the Remix deploy side-bar should be set to “Greeter - Greeter.sol”
    4. Hit “Deploy” button
    5. Once the transaction is complete, save the address of your contract to the report next to your name
3. Each member will now use their Greeter.sol contract to interact with the HelloWorld.sol
    1. Interaction will be done using the UI provided in the Remix deploy side-bar under “Deployed Contracts”
4. Starting with the deployer of the HelloWorld.sol contract, each member should take the following steps:
    1. run “invokeGreeting” passing in the address of the HelloWorld.sol contract
        1. document the transaction hash
        2. document the value as the “before” value
    2. run “setGreeting” passing in HelloWorld.sol address & a new string value
        1. document the transaction hash
    3. run “invokeGreeting” passing in the address of the HelloWorld.sol contract
        1. The returned string should match the new string passed to “setGreeting”
            1. If it does not, group should problem solve
        2. document the transaction hash
        3. document the new value as the “after” value
    4. run “changeOwner” passing in the address of the HelloWorld.sol contract & the wallet address of the next member of the team
        1. “owner” should no longer be your address
            1. If “owner” has not changed, group should problem solve
        2. document the transaction hash
        3. document “owner” before and after
    5. run “setGreeting” passing in HelloWorld.sol address & a new string value
        1. This call should fail
        2. document transaction hash
        3. document result
5. Repeat step #4 until all members have successfully complete and documented all transactions