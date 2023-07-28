// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IHelloWorld {
    function helloWorld() external view returns (string memory);

    function setText(string memory newText) external;

    function transferOwnership(address newOwner) external;

    function getOwner() external returns (address);
}

contract Greeter {
    function invokeGreeting(
        address target
    ) external view returns (string memory) {
        return IHelloWorld(target).helloWorld();
    }

    function setGreeting(address target, string calldata newText) external {
        IHelloWorld(target).setText(newText);
    }

    function changeOwner(address target, address newOwner) external {
        IHelloWorld(target).transferOwnership(newOwner);
    }

    function checkOwner(address target) external returns (address) {
        return IHelloWorld(target).getOwner();
    }
}
