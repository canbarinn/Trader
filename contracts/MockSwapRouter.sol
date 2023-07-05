// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// TASK: Research sqrtPriceLimit and amountOutMinimum
// TASK: Now, we are only swapping tokens, implement amountoutMin and sqrtPriceLimit after research

contract MockSwapRouter {
    // Will be used later
    // struct ExactInputParams {
    //     address tokenIn;
    //     address tokenOut;
    //     address recipient;
    //     uint256 deadline;
    //     uint256 amountIn;
    //     uint256 amountOutMinimum;
    //     uint160 sqrtPriceLimitX96;
    // }

    address public tokenA; // change address type to MockToken IERC20 type
    address public tokenB;
    address private owner;
    // .... public price; // can change with a function call
    // price will be used as 1 tokenA = price x tokenB
    uint256 public price;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        owner = msg.sender;
        // set price
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'You are not the owner!');
        _;
    }

    // can withdraw tokens from contract
    // CANQ: swap islemi yaparken tokenlari direkt olarak msg.senderlara yolladigimiz icin
    // withdraw gerekli olmayabilir

    // can change price
    function setPrice(uint newPrice) external onlyOwner {
        price = newPrice;
    }


    //swap
    function swapExactInputSingle(uint amountIn) external {
        // transfer A in
        TransferHelper.safeTransferFrom(
            tokenA,
            msg.sender,
            address(this),
            amountIn
        );
        TransferHelper.safeApprove(tokenA, address(this), amountIn);

        // send B out
        uint equivalentTokenB = price * amountIn;

        TransferHelper.safeTransfer(tokenB, msg.sender, equivalentTokenB);

        // TASK: if needed to do more like unsiwap
        // function exactInputSingle(params)internal; this function will do the necessary calculations for MockSwapRouter
        //it will check min and max amounts, sqrtpricelimit and also it interacts with pools for price calculations,
        //use it later, with params used as struct at the beginning of the contract
    }

    //swap
    function swapExactOutputSingle(uint amountOut) external {
        uint equivalentTokenA = amountOut / price;

        TransferHelper.safeTransferFrom(
            tokenA,
            msg.sender,
            address(this),
            equivalentTokenA
        );
        TransferHelper.safeApprove(tokenA, address(this), equivalentTokenA);
        TransferHelper.safeTransfer(tokenB, msg.sender, amountOut);
    }
}
