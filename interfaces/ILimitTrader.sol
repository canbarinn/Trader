import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface ILimitTrader {
    // LimitOrder: {For this pair, I want to swap at this price, this much amount} (struct)
    // set at most one limit order
    // remove limit order
    // get limit order status
    //
    // can limit order be filled at the moment
    //      Look at the price, if it is better than the limit price, then return true
    // fill the limit order
    //      try to fill the limit order without checking, if not, reverts
}
