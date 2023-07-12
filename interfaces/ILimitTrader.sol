import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface ILimitTrader {
    struct LimitOrder {
        bool active;
        uint256 priceLimit;
        uint256 inputAmount;
    }

    function placeBuyOrder(uint256 priceLimit, uint256 inputAmount) external;

    function processOrders() external;

    function removeOrder() external;
}
