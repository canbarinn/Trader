// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IMockSwapRouter.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

// TASK: Research sqrtPriceLimit and amountOutMinimum
// TASK: Now, we are only swapping tokens, implement amountoutMin and sqrtPriceLimit after research

contract MockSwapRouter is IMockSwapRouter {
    using SafeERC20 for IERC20;

    address public tokenA; // change address type to MockToken IERC20 type
    address public tokenB;

    // address private owner;
    // .... public price; // can change with a function call
    // price will be used as 1 tokenA = price x tokenB
    // uint256 public price;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        // owner = msg.sender;
        // set price
    }

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "You are not the owner!");
    //     _;
    // }

    // can withdraw tokens from contract
    // CANQ: swap islemi yaparken tokenlari direkt olarak msg.senderlara yolladigimiz icin
    // withdraw gerekli olmayabilir

    // can change price
    // function setPrice(uint newPrice) external onlyOwner {
    //     price = newPrice;
    // }

    //swap
    function swapExactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external {
        // transfer A in
        IERC20(tokenA).safeTransferFrom(
            msg.sender,
            address(this),
            params.amountIn
        );

        IERC20(tokenB).safeTransfer(msg.sender, params.amountIn);

        // TASK: if needed to do more like unsiwap
        // function exactInputSingle(params)internal; this function will do the necessary calculations for MockSwapRouter
        //it will check min and max amounts, sqrtpricelimit and also it interacts with pools for price calculations,
        //use it later, with params used as struct at the beginning of the contract
    }

    //swap
    // function swapExactOutputSingle(uint amountOut) external {
    //     IERC20(tokenA).safeApprove(address(this), amountIn);
    //     IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountIn);

    //     IERC20(tokenB).safeTransfer(msg.sender, amountIn);
    // }
}
