/* tslint:disable:no-unused-expression */

import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers} from "hardhat";

import {
  accessControlFacet,
  accounts,
  buildTestInit,
  centralizedOracleFacet,
  CoolPool,
  coolPoolFacet,
  createCoolPool,
  depositFacet,
  diamondAddress,
  owner,
  retirementFacet,
  roleError,
  submitEmissionForCoolPool,
  tokenA,
  tokenB,
} from "./commons";
import {CENTRALIZED_ORACLE_ADMIN_ROLE, COOLPOOL_ADMIN_ROLE, DEPOSIT_ADMIN_ROLE} from "./roles";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const {AddressZero} = ethers.constants;

const mintAmount = BigNumber.from("44444444444");
const depositUnit = BigNumber.from("33333333333");

describe("Centralized Oracle", async function () {
  let coolPool: CoolPool;
  let owner: SignerWithAddress;
  beforeEach(async function () {
    await buildTestInit();

    await accessControlFacet.grantRole(COOLPOOL_ADMIN_ROLE, owner.address);
    await accessControlFacet.grantRole(DEPOSIT_ADMIN_ROLE, owner.address);
    await accessControlFacet.grantRole(CENTRALIZED_ORACLE_ADMIN_ROLE, owner.address);

    await accessControlFacet.pause(false);

    await tokenB.mint(owner.address, mintAmount);
    await tokenB.approve(diamondAddress, mintAmount);

    coolPool = createCoolPool();
    await coolPool.txPromise;
    coolPool.poolID = await coolPoolFacet.getLastCoolPoolId();

    await depositFacet.deposit(coolPool.poolID, depositUnit);
  });

  it("submit events work as expected", async () => {
    const submission = submitEmissionForCoolPool();
    const tx = await submission.txPromise;
    await tx.wait();

    for (const update of submission.updates) {
      // Expect these to be emitted for every address
      await expect(tx)
        .to.emit(centralizedOracleFacet, "SubmissionCentralized")
        .withArgs(
          coolPool.poolID,
          update.chainId,
          update.address_,
          update.newLastCalculatedBlock,
          update.txCount,
          update.emission
        );

      await expect(tx)
        .to.emit(coolPoolFacet, "TargetAddressUpdated")
        .withArgs(coolPool.poolID, update.address_, update.chainId, update.newLastCalculatedBlock);
    }

    await expect(tx).to.emit(retirementFacet, "Retired");
    await expect(tx).to.emit(depositFacet, "FundsUsed");
  });

  xdescribe("Cases", async function () {
    it("targetAddresses do not have to share chainId or blocknumbers", async () => {
      // Create a coolpool with addresses from different chains with different starting blocks
      // Submit emissions for them ending at different blocks
    });
    it("can submit multiple times for a given target address from a coolpool", async () => {
      // Submit emissions for a target address multiple times
      // Expect the last submission to be the one that is used
    });
    it("can submit emissions when there are multiple pools", async () => {});
  });
  describe("Reverts", async function () {
    it("reverts if not admin", async () => {
      let txPromise = submitEmissionForCoolPool(coolPool.poolID, accounts[4]).txPromise;
      await expect(txPromise).to.be.revertedWith(roleError(accounts[4].address, CENTRALIZED_ORACLE_ADMIN_ROLE));

      txPromise = submitEmissionForCoolPool(coolPool.poolID, owner).txPromise;
      expect(await txPromise);
    });
    xit("reverts if the knownLastBlock is different", async () => {});
    xit("reverts if the pool has insufficient funds", async () => {});
    xit("reverts if one of the target addresses is unknown", async () => {});
  });
});
