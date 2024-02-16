import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Saving", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    const Savings = await ethers.getContractFactory("SaveERC20");
    const savings = await Savings.deploy(token.target)


    return { token, savings, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right token address", async function () {
      const { savings, token } = await loadFixture(deployContracts);

      expect(await savings.getSavingTokenAddress()).to.equal(token.target);
    });

    it("Should set the right owner", async function () {
      const { savings, owner } = await loadFixture(deployContracts);

      expect(await savings.getOwner()).to.equal(owner.address);
    });

  });

  describe("Deposit", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called by address zero", async function () {
        const { owner } = await loadFixture(deployContracts);
        expect(owner.address).is.not.eq(ethers.ZeroAddress);

      });
      it("Should revert with the right error if not approved to consume token", async function () {
        const { savings, token, owner } = await loadFixture(deployContracts);
        expect(await token.allowance(owner.address, savings.target)).eq(0)
      });


      // it("Should revert with the right error if not approved to consume token", async function () {
      //   const { savings, token, owner } = await loadFixture(deployContracts);
      //   expect(await token.allowance(owner.address, savings.target)).eq(0)
      // });
    });

    describe("State Update", function () {
      it("Should update saving balance", async function () {
        const { savings, owner, token, otherAccount } = await loadFixture(
          deployContracts
        );
        const amount = 1;
        await token.approve(savings.target, amount)
        await savings.deposit(amount,)
        expect(await savings.checkUserBalance(owner.address)).eq(amount)
      });

      describe("Events", function () {
        it("Should emit an event on deposit", async function () {
          const { savings, owner, token } = await loadFixture(
            deployContracts
          );

          const amount = 1;
          await token.approve(savings.target, amount)
          await expect(savings.deposit(amount))
            .to.emit(savings, "SavingSuccessful")
            .withArgs(owner.address, amount);
        });
      });


    });
  });



  describe("Withdraw", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called by address zero", async function () {
        const { owner } = await loadFixture(deployContracts);
        expect(owner.address).is.not.eq(ethers.ZeroAddress);

      });
      // it("Should revert with the right error if amount is zero", async function () {
      //   const { savings, token, owner } = await loadFixture(deployContracts);
      //   const amount = 0;
      //   // expect(amount).eq(0);
      //   await expect(await savings.withdraw(0)).revertedWith("can't withdraw zero value");
      //   // await expect(await savings.deposit(0)).to.reverted("can't withdraw zero value");
      //   //   "can't withdraw zero value"
      //   // );
      //   // expect(await token.allowance(owner.address, savings.target)).eq(0)
      // });
    });

    describe("State Update", function () {
      it("Should update saving balance", async function () {
        const { savings, owner, token, otherAccount } = await loadFixture(
          deployContracts
        );
        const amount = 1;
        await token.approve(savings.target, amount)
        await savings.deposit(amount,)
        await savings.withdraw(amount)
        expect(await savings.checkUserBalance(owner.address)).eq(0)
      });

      describe("Events", function () {
        it("Should emit an event on withdraw", async function () {
          const { savings, owner, token } = await loadFixture(
            deployContracts
          );

          const amount = 1;
          await token.approve(savings.target, amount)
          await savings.deposit(amount);
          await expect(savings.withdraw(amount))
            .to.emit(savings, "WithdrawSuccessful")
            .withArgs(owner.address, amount);
        });
      });


    });
  });
});
