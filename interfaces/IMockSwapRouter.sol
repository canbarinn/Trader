import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// import IERC20 from openzeppelin, do not write yourself
// You will write MockToken using it, in a separate file and contract

interface IMockSwapRouter {
    function swapExactOutputSingle(
        uint amountOut
    ) external;

    function swapExactInputSingle(
        uint amountIn
    ) external;
}