import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("LimitTrader", async function () {

    beforeEach(async function () {
        let owner: SignerWithAddress;
        let accounts: SignerWithAddress[];
        accounts = await ethers.getSigners();
        [owner, ...accounts] = accounts;


    })
    



})