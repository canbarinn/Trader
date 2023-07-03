import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract MockSwapRouter {
    address public tokenA; // change address type to MockToken IERC20 type
    address public tokenB;

    // .... public price; // can change with a function call

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        // set price
    }

    // can withdraw tokens from contract

    // can change price

    function exactOutputSingle(
        ISwapRouter.ExactOutputSingleParams calldata params
    ) external returns (uint256 amountIn) {
        // transfer A in
        // send B out
    }

    function exactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external returns (uint256 amountOut) {}
}
