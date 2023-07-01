// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockDex{
    uint token1Reserve;
    uint token2Reserve;

    address public tokenAdress;

    mapping (address => uint) balanceToken1; 
    mapping (address => uint) balanceToken2; 

    function setTokenBalances(uint amountToken1, uint amountToken2) public {
        balanceToken1[msg.sender] = amountToken1;
        balanceToken2[msg.sender] = amountToken2;
        
    }

    function getToken1Balance() public view returns(uint token1Balance){
        token1Balance = balanceToken1[msg.sender];
        
    }
    function getToken2Balance() public view returns(uint token2Balance){
        token2Balance = balanceToken2[msg.sender];
        
    }

    // Bu kisim daha sonra erc20 tokenlarini deposit etmek icin kullanilacak 
    // function setTokenAddress(address _token) public {
    //     tokenAdress = _token;
    // }

    function setToken1Reserve(uint newReserve) public {
        token1Reserve = newReserve;
    }

    function setToken2Reserve(uint newReserve) public {
        token2Reserve = newReserve;
    }

    function getPriceToken1() public view returns(uint price) {
        price = token1Reserve/token2Reserve;
    }

    function getPriceToken2() public view returns(uint price) {
        price = token2Reserve/token1Reserve;
    }

    function buyToken1WithToken2(uint token1Amount) public {
        uint token1Price = getPriceToken1();
        uint token2Price = getPriceToken2();
        if(token1Price>0) {
            balanceToken2[msg.sender] -= token1Price * token1Amount;
            balanceToken1[msg.sender] += token1Amount;
        } else if (token2Price>0) {
            balanceToken2[msg.sender] -= token1Amount / token2Price;
            balanceToken1[msg.sender] += token1Amount;
        } 
    }

    function buyToken2WithToken1(uint token2Amount) public { 
        uint token1Price = getPriceToken1();
        uint token2Price = getPriceToken2();
        if (token2Price>0) {
            balanceToken1[msg.sender] -= token2Price * token2Amount;
            balanceToken2[msg.sender] += token2Amount;
        } else if (token1Price>0) {
            balanceToken1[msg.sender] -= token2Amount / token1Price;
            balanceToken2[msg.sender] += token2Amount;
        }
    }


}