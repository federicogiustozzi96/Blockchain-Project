const { expect } = require("chai");

describe("Token contract 1", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    
    //A Signer in ethers.js is an object that represents an Ethereum account. 
    //It's used to send transactions to contracts and other accounts. 
    //Here we're getting a list of the accounts in the node we're connected to, which in this case is Hardhat Network, and we're only keeping the first one.
    //The ethers variable is available in the global scope. 
    const [owner, addr1, addr2] = await ethers.getSigners();

    //Calling ethers.deployContract("Token") will start the deployment of our token contract, and return a Promise that resolves to a Contract.
    // This is the object that has a method for each of your smart contract functions.
    const hardhatToken = await ethers.deployContract("Token");

    //Once the contract is deployed, we can call our contract methods on hardhatToken. 
    //Here we get the balance of the owner account by calling the contract's balanceOf() method.
    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    //the account that deploys the token gets its entire supply. By default, Contract instances are connected to the first signer. 
    //This means that the account in the owner variable executed the deployment, and balanceOf() should return the entire supply amount.
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    //Here we're again using our Contract instance to call a smart contract function in our Solidity code. 
    //totalSupply() returns the token's supply amount and we're checking that it's equal to ownerBalance, as it should be. (DONE WITH CHAI)

  });
});