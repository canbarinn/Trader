pragma solidity ^0.8.20;
// import IERC20 from openzeppelin, do not write yourself
// You will write MockToken using it, in a separate file and contract

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IMockSwapRouter {
    function swapExactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external;
}
