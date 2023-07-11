// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../interfaces/IMockSwapRouter.sol";
import "../interfaces/ILimitTrader.sol";
import "hardhat/console.sol";

contract LimitTrader is ILimitTrader {
    using SafeERC20 for IERC20;

    address public tokenA;
    address public tokenB;
    address public swapRouter;
    
    
    constructor(address _tokenA, address _tokenB, address _swapRouter) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        swapRouter = _swapRouter;
    }

    // uint256 public orderNumberCounter; // CANQ: should we use it like that?

    enum AboveOrBelow {
        Above,
        Below
    }

    struct LimitOrders {
        uint256 priceLimit;
        uint256 inputAmount;
        AboveOrBelow direction;
    }

    // mapping (uint256 => LimitOrders[]) limitOrdersMapping; // order number=>Limit order struct  // CANQ: should we use it like that?
    LimitOrders[] limitOrdersArray; // max array length should be 10

    function placeBuyOrder(
        uint256 priceLimit,
        uint256 inputAmount,
        AboveOrBelow direction
    ) public {
        require(limitOrdersArray.length <= 10, "You cannot place new orders!");
        limitOrdersArray.push(LimitOrders(priceLimit, inputAmount, direction));
    }

    function processOrders() public {
        uint256 price = askPrice();
        for (uint256 i = 0; i < limitOrdersArray.length; i++) {
            if (
                uint(limitOrdersArray[i].direction) == 0 &&
                price > limitOrdersArray[i].priceLimit
            ) {
                triggerSwap(limitOrdersArray[i].inputAmount);
                removeOrder(i);
            } else if (
                uint(limitOrdersArray[i].direction) == 1 &&
                price < limitOrdersArray[i].priceLimit
            ) {
                triggerSwap(limitOrdersArray[i].inputAmount);
                removeOrder(i);
            } 
        }
    }

    function removeOrder(uint256 index) public {
        for (uint256 i = index; i < limitOrdersArray.length - 1; i++) {
            limitOrdersArray[i] = limitOrdersArray[i + 1];
        }
        limitOrdersArray.pop();
    }


    function askPrice() public returns (uint price) {
        price = IMockSwapRouter(swapRouter).getPrice();
        console.log("CURRENT PRICE: ", price);
    }

    function triggerSwap(uint256 spendAmount) public returns (uint256) {
        // CANQ: ne return edebilirim?

        IERC20(tokenA).safeApprove(swapRouter, spendAmount);

        IMockSwapRouter(swapRouter).swapExactInputSingle(
            ISwapRouter.ExactInputSingleParams(
                tokenA,
                tokenB,
                0,
                address(this),
                0,
                spendAmount,
                0,
                0
            )
        );
    }
}
