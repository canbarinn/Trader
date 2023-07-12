// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IMockSwapRouter.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract MockSwapRouter is IMockSwapRouter {
    using SafeERC20 for IERC20;

    address public tokenA;
    address public tokenB;
    uint public price = 150;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function swapExactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external {
        require(params.tokenIn == tokenA || params.tokenOut == tokenB, "Invalid token.");
        IERC20(tokenA).safeTransferFrom(
            msg.sender,
            address(this),
            params.amountIn
        );

        IERC20(tokenB).safeTransfer(msg.sender, params.amountIn);
    }

    // function swapExactOutputSingle
}
