/* tslint:disable:no-unused-expression no-unnecessary-initializer */

import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumberish, ContractReceipt, ContractTransaction} from "ethers";
import {ethers} from "hardhat";
import {CoolPoolSimpleStruct, TargetAddressesManager} from "typechain/contracts/facets/CoolPoolFacet";

import {deployDiamond} from "../scripts/deploy/deploy";
import {
  AccessControlFacet,
  CentralizedOracleFacet,
  CoolPoolFacet,
  DepositFacet,
  DiamondCutFacet,
  DiamondLoupeFacet,
  MockToken,
  OwnershipFacet,
  RetirementFacet,
  SupportedChainsFacet,
  TriggerFacet,
} from "../typechain";

import {DEPOSIT_ADMIN_ROLE} from "./roles";

export let owner: SignerWithAddress;
export let accounts: SignerWithAddress[];
export let allAccounts: SignerWithAddress[];

export let diamondAddress: string;

export let diamondCutFacet: DiamondCutFacet;
export let diamondLoupeFacet: DiamondLoupeFacet;
export let ownershipFacet: OwnershipFacet;

export let accessControlFacet: AccessControlFacet;
export let coolPoolFacet: CoolPoolFacet;
export let depositFacet: DepositFacet;
export let centralizedOracleFacet: CentralizedOracleFacet;
export let retirementFacet: RetirementFacet;
export let triggerFacet: TriggerFacet;
export let supportedChainsFacet: SupportedChainsFacet;

export let tokenA: MockToken;
export let tokenB: MockToken;

export async function waitTx(tx: ContractTransaction) {
  const receipt: ContractReceipt = await tx.wait();
  return receipt;
}

export interface RecurrentOffset {
  tonnes: number;
  perSeconds: number;
  startTimestamp: number;
  description: string;
}
export interface CoolPool {
  txPromise: Promise<ContractTransaction>;
  greenToken: string;
  depositableToken: string;
  sustainabilityTargetPercent: number;
  targetAddresses: TargetAddressesManager.AddTargetAddressStruct[];
  poolID?: BigNumberish;
  recurrentOffset: RecurrentOffset;
}

export function createCoolPool(
  signer: SignerWithAddress = owner,
  greenToken: string = tokenB.address,
  depositableToken: string = tokenB.address,
  sustainabilityTargetPercent: number = 150,
  targetAddresses: TargetAddressesManager.AddTargetAddressStruct[] = [
    {chainId: 0, address_: accounts[0].address, firstCalculatedBlock: 0},
    {chainId: 0, address_: accounts[1].address, firstCalculatedBlock: 0},
    {chainId: 0, address_: accounts[2].address, firstCalculatedBlock: 0},
  ],
  recurrentOffset: RecurrentOffset = {tonnes: 0, perSeconds: 0, startTimestamp: 0, description: ""}
): CoolPool {
  const txPromise = coolPoolFacet
    .connect(signer)
    .createCoolPool(greenToken, depositableToken, sustainabilityTargetPercent, targetAddresses, recurrentOffset);

  return {txPromise, greenToken, depositableToken, sustainabilityTargetPercent, targetAddresses, recurrentOffset};
}

export interface SubmitPayload extends TargetAddressesManager.UpdateTargetAddressStruct {
  txCount: BigNumberish;
  emission: BigNumberish;
}

export function submitEmissionForCoolPool(
  poolID: BigNumberish = 1,
  signer: SignerWithAddress = owner,
  updates: SubmitPayload[] = [
    {
      chainId: 0,
      address_: accounts[0].address,
      knownLastCalculatedBlock: 0,
      newLastCalculatedBlock: 1,
      txCount: 2,
      emission: 3,
    },
    {
      chainId: 0,
      address_: accounts[1].address,
      knownLastCalculatedBlock: 0,
      newLastCalculatedBlock: 1,
      txCount: 4,
      emission: 7,
    },
  ]
) {
  const innerUpdates = updates as TargetAddressesManager.UpdateTargetAddressStruct[];
  const txCounts = updates.map((u) => u.txCount);
  const emissions = updates.map((u) => u.emission);
  const txPromise = centralizedOracleFacet
    .connect(signer)
    .submitEmissionForCoolPool(poolID, innerUpdates, txCounts, emissions);

  return {txPromise, updates, poolID};
}

export function roleError(accountAddress: string, role: string) {
  return `Modifiers: Account ${accountAddress.toLowerCase()} doesn't have the role ${role.toLowerCase()}`;
}

export async function buildTestInit() {
  allAccounts = await ethers.getSigners();
  [owner, ...accounts] = allAccounts;

  diamondAddress = await deployDiamond();
  diamondCutFacet = (await ethers.getContractAt("DiamondCutFacet", diamondAddress)) as DiamondCutFacet;
  diamondLoupeFacet = (await ethers.getContractAt("DiamondLoupeFacet", diamondAddress)) as DiamondLoupeFacet;
  ownershipFacet = (await ethers.getContractAt("OwnershipFacet", diamondAddress)) as OwnershipFacet;

  accessControlFacet = (await ethers.getContractAt("AccessControlFacet", diamondAddress)) as AccessControlFacet;

  coolPoolFacet = (await ethers.getContractAt("CoolPoolFacet", diamondAddress)) as CoolPoolFacet;
  depositFacet = (await ethers.getContractAt("DepositFacet", diamondAddress)) as DepositFacet;
  centralizedOracleFacet = (await ethers.getContractAt(
    "CentralizedOracleFacet",
    diamondAddress
  )) as CentralizedOracleFacet;
  retirementFacet = (await ethers.getContractAt("RetirementFacet", diamondAddress)) as RetirementFacet;
  triggerFacet = (await ethers.getContractAt("TriggerFacet", diamondAddress)) as TriggerFacet;
  supportedChainsFacet = (await ethers.getContractAt("SupportedChainsFacet", diamondAddress)) as SupportedChainsFacet;

  const tokenFactory = await ethers.getContractFactory("MockToken");
  tokenA = (await tokenFactory.deploy("MockA", "MOCKA")) as MockToken;
  tokenB = (await tokenFactory.deploy("MockB", "MOCKB")) as MockToken;

  await retirementFacet.setMock(tokenA.address, tokenB.address);
}
