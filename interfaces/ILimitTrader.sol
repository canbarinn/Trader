import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface ILimitTrader {

    // constructor tokens, router

    function triggerSwap(uint256 spendAmount) external returns (uint256);
}
