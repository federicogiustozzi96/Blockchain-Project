// Importa Chai per le asserzioni
const { expect } = require("chai");

// Importa ethers per interagire con Ethereum
const { ethers } = require("hardhat");
const { bigint } = require("hardhat/internal/core/params/argumentTypes");

// Definisci il blocco principale dei test
describe("Token contract", function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Prima di ogni test, distribuisce il contratto Token
    beforeEach(async function () {
        
        // Ottieni il contratto TokenFactory e gli indirizzi degli utenti
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Token");

        // Distribuisce il contratto Token
        token = await Token.deploy();
        await token.waitForDeployment();
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
            await addr1.sendTransaction({ to: token.target, value: amountInEther });
            
            await token.connect(addr1).buyTokens({ value: amountInEther });

            // Controlla che l'utente abbia ricevuto i token correttamente
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(amountInEther / (await token.rate()));
        });
    });

    // Test per il ritiro di Ether
    describe("Withdraw", function () {
        it("Should allow the owner to withdraw Ether", async function () {
            const amountInEther = ethers.parseEther("1");
            await addr1.sendTransaction({ to: token.target, value: amountInEther });

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

    describe("Selling Tokens", function () {
        it("Should allow a user to sell tokens and receive Ether", async function () {

            // prezzo token
            const rate = 1000000000000;

            // Imposta un saldo iniziale per addr1 e addr2
            await token.connect(owner).transfer(addr1.address, 1000); // Trasferisce 1000 token a addr1
            await token.connect(owner).transfer(addr2.address, 500);  // Trasferisce 500 token a addr2

            // Il contratto riceve fondi iniziali in Ether per simulare la vendita di token
            await owner.sendTransaction({ to: token.target, value: ethers.parseEther("1.0") });

            const amountToSell = 10;
            const etherAmount = amountToSell * rate;

            // Ottieni il saldo Ether di addr1 prima della vendita
            const initialEtherBalance = await ethers.provider.getBalance(addr1.address);

            // Addr1 vende 10 token
            await expect(token.connect(addr1).sellToken(amountToSell))
                .to.emit(token, "Transfer")
                .withArgs(addr1.address, owner.address, amountToSell);

            // Verifica il saldo token di addr1 e del contratto
            const addr1Balance = await token.balanceOf(addr1.address);
            const ownerBalance = await token.balanceOf(owner.address);

            expect(addr1Balance).to.equal(1000 - amountToSell); // Il saldo token di addr1 dovrebbe diminuire di 10
            expect(ownerBalance).to.equal(998510); // Il saldo token del proprietario dovrebbe aumentare di 10

            /* Verifica che il contratto abbia meno Ether dopo la vendita
            const contractBalance = await ethers.provider.getBalance(token.target);
            expect(contractBalance).to.equal(ethers.parseEther("1.0") - etherAmount); // Il saldo Ether del contratto dovrebbe diminuire di etherAmount
            */
        });

        it("Should fail if user tries to sell more tokens than they have", async function () {
            const amountToSell = 2000; // Addr1 ha solo 1000 token, quindi questo dovrebbe fallire

            await expect(token.connect(addr1).sellToken(amountToSell)).to.be.revertedWith("Not enough tokens to sell");
        });
    });


    // Test per la funzione mintNFT
    describe("Minting NFTs", function () {
        it("Should mint a new NFT and assign it to the caller", async function () {
            const price = 100; // Prezzo dell'NFT in token
            const imageURI = "ipfs://example-uri"; // URI dell'immagine

            // Chiama la funzione mintNFT con addr1
            await expect(token.connect(addr1).mintNFT(price, imageURI))
                .to.emit(token, "NFTMinted") // Controlla se l'evento è stato emesso
                .withArgs(1, addr1.address); // Controlla gli argomenti dell'evento

            // Verifica che il proprietario del tokenId 0 sia addr1
            const nft = await token.nfts(1);
            expect(nft.owner).to.equal(addr1.address);
            expect(nft.price).to.equal(price);
            expect(nft.imageURI).to.equal(imageURI);
        });

        it("Should increment the tokenId correctly", async function () {
            const price = 100; // Prezzo dell'NFT in token
            const imageURI1 = "ipfs://example-uri-1";
            const imageURI2 = "ipfs://example-uri-2";

            // Minta il primo NFT
            await token.connect(addr1).mintNFT(price, imageURI1);
            // Minta il secondo NFT
            await token.connect(addr2).mintNFT(price, imageURI2);

            // Verifica che il tokenId sia incrementato correttamente
            const nft1 = await token.nfts(0);
            const nft2 = await token.nfts(1);

            expect(nft1.tokenId).to.equal(0);
            expect(nft2.tokenId).to.equal(1);
        });
    });
    
});
