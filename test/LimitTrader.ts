import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MockToken, MockSwapRouter, LimitTrader } from "../typechain-types";

describe("MockSwapRouter", function () {
  async function deployFixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("MockToken");
    const tokenA = (await tokenFactory.deploy("TokenA", "A")) as MockToken;
    const tokenB = (await tokenFactory.deploy("TokenB", "B")) as MockToken;
    const addressTokenA = tokenA.getAddress();
    const addressTokenB = tokenB.getAddress();
    const swapFactory = await ethers.getContractFactory("MockSwapRouter");
    const swap = (await swapFactory.deploy(addressTokenA, addressTokenB)) as MockSwapRouter;
    const swapRouterAddress = swap.getAddress();
    const traderFactory = await ethers.getContractFactory("LimitTrader");
    const limitTrader = (await traderFactory.deploy(addressTokenA, addressTokenB, swapRouterAddress)) as LimitTrader;
    const limitTraderAddress = limitTrader.getAddress();

    await tokenA.mint(owner.address, 1000);
    await tokenA.approve(await swapRouterAddress, 1000);
    await tokenB.mint(await swapRouterAddress, 1000);

    await tokenA.approve(await limitTraderAddress, 1000);
    await tokenB.approve(await limitTraderAddress, 1000);
    await tokenA.mint(await limitTraderAddress, 1000);
    await tokenB.mint(await limitTraderAddress, 1000);

    return { swap, limitTrader, tokenA, tokenB, owner, accounts, addressTokenA, addressTokenB, swapRouterAddress, limitTraderAddress };
  }

  describe("Basic", async function () {
    it("exact input", async function () {
      const { swap, tokenA, tokenB, limitTrader, owner, addressTokenA, addressTokenB, swapRouterAddress, limitTraderAddress } = await loadFixture(deployFixture);
      const exactInputSingleParams = {
        tokenIn: await addressTokenA,
        tokenOut: await addressTokenB,
        fee: 0,
        recipient: owner.address,
        deadline: 0,
        amountIn: 100,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      };

      const beforeBalanceTokenAOfRouter = await tokenA.balanceOf(await swapRouterAddress);
      const beforeBalanceTokenBOfRouter = await tokenA.balanceOf(await swapRouterAddress);
      const beforeBalanceTokenAOfLimitTrader = await tokenA.balanceOf(await limitTraderAddress);
      const beforeBalanceTokenBOfLimitTrader = await tokenA.balanceOf(await limitTraderAddress);

      console.log(
        "BEFORE \n",
        "Router Token A Balance:",
        beforeBalanceTokenAOfRouter,
        "\n Router Token B Balance:",
        beforeBalanceTokenBOfRouter,
        "\nLimitTrader Token A Balance:",
        beforeBalanceTokenAOfLimitTrader,
        "\nLimitTrader Token B Balance:",
        beforeBalanceTokenBOfLimitTrader
      );

      await limitTrader.triggerSwap(exactInputSingleParams.amountIn);
      const price = await limitTrader.askPrice();

      const afterBalanceTokenBOfRouter = await tokenA.balanceOf(await swapRouterAddress);
      const afterBalanceTokenAOfRouter = await tokenA.balanceOf(await swapRouterAddress);
      const afterBalanceTokenAOfLimitTrader = await tokenA.balanceOf(await limitTraderAddress);
      const afterBalanceTokenBOfLimitTrader = await tokenA.balanceOf(await limitTraderAddress);

      console.log(
        "AFTER \n",
        "Router Token A Balance:",
        afterBalanceTokenAOfRouter,
        "\n Router Token B Balance:",
        afterBalanceTokenBOfRouter,
        "\nLimitTrader Token A Balance:",
        afterBalanceTokenAOfLimitTrader,
        "\nLimitTrader Token B Balance:",
        afterBalanceTokenBOfLimitTrader
      );
      // await swap.swapExactInputSingle(exactInputSingleParams)

      // expect(await tokenA.balanceOf(await swapRouterAddress)).to.equal(100)
      // expect(await tokenA.balanceOf(owner.address)).to.equal(900)
      // expect(await tokenB.balanceOf(await swapRouterAddress)).to.equal(900)
      // expect(await tokenB.balanceOf(owner.address)).to.equal(100)
      // console.log(await tokenB.balanceOf(swapRouterAddress))
      // console.log(await tokenA.balanceOf(swapRouterAddress))
    });
  });
});
