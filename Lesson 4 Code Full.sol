// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IHelloWorld {
    function helloWorld() external view returns (string memory);

    function setText(string memory newText) external;
}

contract HelloWorld {
    string private text;

    constructor() {
        text = pureText();
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public {
        text = newText;
    }

    function pureText() public pure virtual returns (string memory) {
        return "Hello World";
    }
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
}
