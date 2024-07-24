// Importa Chai per le asserzioni
const { expect } = require("chai");

// Importa ethers per interagire con Ethereum
const { ethers } = require("hardhat");

// Definisci il blocco principale dei test
describe("Token contract", function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Prima di ogni test, deploya il contratto Token
    beforeEach(async function () {
        // Ottieni il contratto TokenFactory e gli indirizzi degli utenti
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploya il contratto Token
        token = await Token.deploy();
    });

    // Test per la deployment del contratto
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(ownerBalance).to.equal(await token.totalSupply());
        });
    });

    // Test per le transazioni del contratto
    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Trasferisce 50 token da owner ad addr1
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
        
            // Controlla che i token siano stati trasferiti correttamente
            const ownerBalance = await token.balanceOf(owner.address);
            const expectedBalance = await token.totalSupply();
            expect(Number(ownerBalance)).to.equal(Number(expectedBalance) - 50); // Converte esplicitamente in Number. 
        });
        
        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await token.balanceOf(owner.address);
    
            // Try to transfer more tokens than owner has
            const amountToSend = ethers.parseEther("101"); // Amount greater than owner's balance
            await expect(token.connect(addr1).transfer(addr2.address, amountToSend))
                .to.be.revertedWith("Not enough tokens");
    
            // Verifica che i saldi non siano cambiati
            expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
                
    });

    // Test per l'acquisto di token
    describe("Buy tokens", function () {
        it("Should allow users to buy tokens by sending ether", async function () {
            const amountInEther = ethers.parseEther("1"); // Converti 1 ether in wei
            await addr1.sendTransaction({ to: token.address, value: amountInEther });
            
            // Controlla che l'utente abbia ricevuto i token correttamente
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(amountInEther.mul(await token.rate()));
        });
    });

    // Test per il ritiro di Ether
    describe("Withdraw", function () {
        it("Should allow the owner to withdraw Ether", async function () {
            const amountInEther = ethers.parseEther("1");
            await addr1.sendTransaction({ to: token.address, value: amountInEther });

            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
            
            // Esegui il ritiro di Ether
            await token.connect(owner).withdraw();

            // Verifica che il saldo del proprietario sia aumentato
            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
            expect(finalOwnerBalance).to.be.above(initialOwnerBalance);
        });

        it("Should not allow non-owner to withdraw Ether", async function () {
            await expect(token.connect(addr1).withdraw()).to.be.revertedWith("Only the owner can withdraw funds");
        });
    });
});
