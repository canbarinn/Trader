import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MockToken, MockSwapRouter } from "../typechain-types";

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

    await tokenA.mint(owner.address, 1000);
    await tokenA.approve(await swapRouterAddress, 1000);
    await tokenB.mint(await swapRouterAddress, 1000);

    return { swap, tokenA, tokenB, owner, accounts, addressTokenA, addressTokenB, swapRouterAddress };
  }

  describe("Basic", async function () {
    it("exact input", async function () {
      const { tokenA, tokenB, swap, owner, addressTokenA, addressTokenB, swapRouterAddress } = await loadFixture(deployFixture);
      const exactInputSingleParams = {
        tokenIn: await addressTokenA,
        tokenOut: await addressTokenB,
        fee: 3000,
        recipient: owner.address,
        deadline: 0,
        amountIn: 100,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      };
      await swap.swapExactInputSingle(exactInputSingleParams);

      expect(await tokenA.balanceOf(await swapRouterAddress)).to.equal(100);
      expect(await tokenA.balanceOf(owner.address)).to.equal(900);
      expect(await tokenB.balanceOf(await swapRouterAddress)).to.equal(900);
      expect(await tokenB.balanceOf(owner.address)).to.equal(100);

      const falseExactInputSingleParams = {
        tokenIn: await addressTokenB,
        tokenOut: await addressTokenA,
        fee: 3000,
        recipient: owner.address,
        deadline: 0,
        amountIn: 100,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      };

      await expect(swap.swapExactInputSingle(falseExactInputSingleParams)).to.revertedWith("Invalid token.");
    });
  });
});
/*

describe("MockSwapRouter", function () {
  
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.target)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});

*/
