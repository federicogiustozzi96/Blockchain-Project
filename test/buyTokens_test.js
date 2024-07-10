const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSale contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let rate = 100; // Example rate: 1 ETH = 100 tokens

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, _] = await ethers.getSigners();

    // Deploy the contract.
    token = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should buy tokens", async function () {
      // Address 1 buys tokens
      const tokensToBuy = 1; // in ETH
      const expectedTokens = tokensToBuy * rate;

      await token.connect(addr1).buyTokens({ value: ethers.utils.parseEther(tokensToBuy.toString()) });

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(expectedTokens);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal((await token.totalSupply()) - expectedTokens);
    });

    it("Should emit Transfer event on token purchase", async function () {
      const tokensToBuy = 1; // in ETH
      const expectedTokens = tokensToBuy * rate;

      await expect(token.connect(addr1).buyTokens({ value: ethers.utils.parseEther(tokensToBuy.toString()) }))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, expectedTokens);
    });

    it("Should fail if not enough tokens are available for sale", async function () {
      // First, addr1 buys all tokens
      const totalSupply = await token.totalSupply();
      await token.connect(addr1).buyTokens({ value: ethers.utils.parseEther((totalSupply / rate).toString()) });

      // Then, addr2 tries to buy tokens but none are available
      await expect(token.connect(addr2).buyTokens({ value: ethers.utils.parseEther("1") }))
        .to.be.revertedWith("Not enough tokens available");
    });
  });
});