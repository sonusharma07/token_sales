// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract DappToken {
    string public name = "DappToken";
    string public symbol = "DAT";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) allowance;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Allowance(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initSupply) {
        totalSupply = _initSupply;
        balanceOf[msg.sender] = _initSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool sucess)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Allowance(msg.sender, _spender, _value);
        return true;
    }
    
}
