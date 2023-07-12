import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MockToken, MockSwapRouter, LimitTrader } from "../typechain-types";

describe("LimitTrader", function () {
  async function deployFixture() {
    const [owner, ...accounts] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("MockToken");
    const tokenA = (await tokenFactory.deploy("TokenA", "A")) as MockToken;
    const tokenB = (await tokenFactory.deploy("TokenB", "B")) as MockToken;
    const addressTokenA = tokenA.getAddress();
    const addressTokenB = tokenB.getAddress();
    const swapRouterFactory = await ethers.getContractFactory("MockSwapRouter");
    const swapRouter = (await swapRouterFactory.deploy(addressTokenA, addressTokenB)) as MockSwapRouter;
    const swapRouterAddress = swapRouter.getAddress();
    const limitTraderFactory = await ethers.getContractFactory("LimitTrader");
    const limitTrader = (await limitTraderFactory.deploy(addressTokenA, addressTokenB, swapRouterAddress)) as LimitTrader;
    const limitTraderAddress = limitTrader.getAddress();

    await tokenA.approve(await swapRouterAddress, 1000);
    await tokenB.mint(await swapRouterAddress, 1000);

    return { swapRouter, limitTrader, tokenA, tokenB, owner, accounts, addressTokenA, addressTokenB, swapRouterAddress, limitTraderAddress };
  }

  describe("Functions", async function () {
    it("empty limit order", async function () {
      const { tokenA, tokenB, limitTrader, swapRouterAddress, limitTraderAddress } = await loadFixture(deployFixture);
      const swapAmountIn = 100;
      const priceLimit = 0;
      await tokenA.mint(limitTraderAddress, 1000);

      expect(await tokenA.balanceOf(await swapRouterAddress)).to.equal(0);
      expect(await tokenA.balanceOf(await limitTraderAddress)).to.equal(1000);
      expect(await tokenB.balanceOf(await swapRouterAddress)).to.equal(1000);
      expect(await tokenB.balanceOf(await limitTraderAddress)).to.equal(0);

      await limitTrader.placeBuyOrder(priceLimit, swapAmountIn);
      await limitTrader.processOrder();

      expect(await tokenA.balanceOf(await swapRouterAddress)).to.equal(100);
      expect(await tokenA.balanceOf(await limitTraderAddress)).to.equal(900);
      expect(await tokenB.balanceOf(await swapRouterAddress)).to.equal(900);
      expect(await tokenB.balanceOf(await limitTraderAddress)).to.equal(100);
    });
    it("place/remove limit order", async function () {
      const { tokenA, limitTrader, limitTraderAddress } = await loadFixture(deployFixture);
      const swapAmountIn = 100;
      const priceLimit = 0;
      await tokenA.mint(limitTraderAddress, 1000);

      await limitTrader.placeBuyOrder(priceLimit, swapAmountIn);
      expect(await limitTrader.processOrder()).to.not.reverted;

      await limitTrader.placeBuyOrder(priceLimit, swapAmountIn);
      await limitTrader.removeOrder();

      await expect(limitTrader.processOrder()).to.revertedWith("You do not have any limit order.");
    });
    it("empty limit order", async function () {
      const { limitTrader } = await loadFixture(deployFixture);

      await expect(limitTrader.processOrder()).to.revertedWith("You do not have any limit order.");
    });
  });
});
