// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../interfaces/IMockSwapRouter.sol";
import "../interfaces/ILimitTrader.sol";
import "hardhat/console.sol";

contract LimitTrader {
    using SafeERC20 for IERC20;

    address public tokenA;
    address public tokenB;
    address public swapRouter;
    
    
    constructor(address _tokenA, address _tokenB, address _swapRouter) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        swapRouter = _swapRouter;
        limitOrder = LimitOrder(false, 0, 0);
    }

    struct LimitOrder {
        bool active;
        uint256 priceLimit;
        uint256 inputAmount;
    }

    LimitOrder public limitOrder;

    function placeBuyOrder(
        uint256 priceLimit,
        uint256 inputAmount
    ) public {
        require(limitOrder.active == false, "You have to remove previous limit order first.");
        limitOrder = LimitOrder(true, priceLimit, inputAmount);
    }

    function processOrders() public {
            require(limitOrder.active == true, "You do not have any limit order.");
            IERC20(tokenA).safeApprove(swapRouter, limitOrder.inputAmount);
            IMockSwapRouter(swapRouter).swapExactInputSingle(
                ISwapRouter.ExactInputSingleParams(
                    tokenA,
                    tokenB,
                    0,
                    address(this),
                    0,
                    limitOrder.inputAmount,
                    0,
                    0
                )
            );
            limitOrder = LimitOrder(false, 0, 0);
        

    }

    function removeOrder() public {
        limitOrder = LimitOrder(false, 0, 0);
    }

    // PRICE SHOULD RETURN 2 UINTS TO INDICATE THE RELATIONSHIP BETWEEN 2 TOKENS

}
