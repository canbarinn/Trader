// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../interfaces/IMockSwapRouter.sol";
import "../interfaces/ILimitTrader.sol";

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

    function triggerSwap(uint256 spendAmount) public returns(uint256) {
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
