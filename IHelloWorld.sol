// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IHelloWorld {
    function helloWorld() external view returns (string memory);

    function setText(string memory newText) external;

    function transferOwnership(address newOwner) external;
}
