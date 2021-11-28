// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "./DappToken.sol";

contract DappSales {
    DappToken public dappToken;
    uint256 public tokenPrice;
    address admin;
    uint256 public tokenSold;
    event Sell(address indexed _buyer, uint256 _numberOfTokens);

    constructor(DappToken _dappToken, uint256 _tokenPrice) {
        dappToken = _dappToken;
        tokenPrice = _tokenPrice;
        admin = msg.sender;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(tokenPrice, _numberOfTokens));
        require(dappToken.balanceOf(address(this)) >= _numberOfTokens);
        require(dappToken.transfer(msg.sender, _numberOfTokens));
        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        dappToken.transfer(admin, dappToken.balanceOf(address(this)));
        selfdestruct(payable(admin));
    }
}

/**
 DappToken.transfer(tokenSales.address, tokensAvailable ,{from : admin});
  */