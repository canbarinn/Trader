import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

// import IERC20 from openzeppelin, do not write yourself
// You will write MockToken using it, in a separate file and contract

interface IMockSwapRouter {
    function exactOutputSingle(
        ISwapRouter.ExactOutputSingleParams calldata params
    ) external returns (uint256 amountIn);

    function exactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external returns (uint256 amountOut);
}
