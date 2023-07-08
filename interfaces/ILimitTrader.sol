import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface ILimitTrader {
    function triggerSwap(uint256 spendAmount) external returns (uint256);
}
