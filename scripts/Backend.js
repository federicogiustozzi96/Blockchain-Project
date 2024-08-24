const { ethers } = require('ethers');
require("dotenv").config();

// Configura la connessione al provider di Hardhat
const provider = ethers.getDefaultProvider('http://127.0.0.1:8545');

// Chiave privata dell'account che eseguirà la transazione
// Nota: Hardhat solitamente fornisce account preconfigurati con chiavi private, puoi prenderne una da lì
const privateKey = process.env.PRIVATE_KEY_1;
//const privateKey = process.env.PRIVATE_KEY;

// Creare un'istanza del wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Creare un'istanza dell'utente che ha richiamato il contratto
const signer = new ethers.Wallet(privateKey, provider);

// Indirizzo del contratto e ABI
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
    // L'ABI dovrebbe includere la definizione della funzione buyTokens
    "function buyTokens() public payable",
    "function reward(uint256 amountToReward) external",
    "function sellToken(uint256 amountToSell) external",
    "function balanceOf(address account) view returns (uint256)",
    "function mintNFT(uint256 price, string calldata imageURI) external",
    "function getImageURI(uint256 tokenId) view returns (string)",
    "function listNFTForSale(uint256 tokenId, uint256 price) external",
    "function buyNFT(uint256 tokenId) external"
];

// Creare un'istanza del contratto
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function updateBalance() {
    const balance = await contract.balanceOf(wallet.address);
    console.log("Updated balance:", balance.toString());
    // Aggiorna l'interfaccia utente con il nuovo bilancio
}

// Definire la funzione per acquistare i token 
async function buyToken(amount) {
    // Imposta il valore che vuoi inviare (ad esempio, 1 ETH)
    const valueToSend = ethers.parseEther(amount);
    console.log('Amount: ', valueToSend);
    
    try {
        // Ottieni il nonce corrente
        const nonce = await provider.getTransactionCount(signer.getAddress(), 'latest');

        // Eseguire la transazione chiamando la funzione buyTokens
        const tx = await contract.buyTokens({ value:valueToSend, nonce: nonce });

        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione        
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt.hash);

        // Aggiorna il bilancio dopo l'acquisto
        await updateBalance();
    } catch (error) {
        console.error('Error buying tokens:', error);
    }
}

// Definire la funzione per vendere i token
async function sell(amountToSell) {
    try {
        // Ottieni il nonce corrente
        const nonce = await provider.getTransactionCount(signer.getAddress(), 'latest');

        // Eseguire la transazione chiamando la funzione sellToken
        const tx = await contract.sellToken(amountToSell, { nonce: nonce });
        console.log('Sell transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Sell transaction mined:', receipt.hash);

        // Aggiorna il bilancio dopo la vendita
        await updateBalance();
    } catch (error) {
        console.error('Error selling tokens:', error);
    }
}

// Definire la funzione per ricompensare i punteggi dei giochi e delle quest con i token
async function reward(amountToReward) {
    try {
        // Ottieni il nonce corrente
        const nonce = await provider.getTransactionCount(signer.getAddress(), 'latest');

        // Eseguire la transazione chiamando la funzione reward con il nonce specificato
        const tx = await contract.reward(amountToReward, { nonce: nonce });
        console.log('Reward transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Reward transaction mined:', receipt.hash);

        // Aggiorna il bilancio dopo il reward
        await updateBalance();
    } catch (error) {
        console.error('Error executing reward:', error);
    }
}


// Costruisci la URI dell'immagine
const imageCID = 'QmQvPkUSTgsFDzSxe72eBG1efq92kABK82VLsbRBTmYNix';
const imageURI = `https://ipfs.io/ipfs/${imageCID}`; // URI dell'immagine su IPFS
const priceInTokens = ethers.parseUnits('10', 18); // Ad esempio 10 DNT

// Definire la funzione per generare gli NFT
async function mint_NFT() {
    try {
        /* Controlla se il contratto ha l'autorizzazione per trasferire i token
        const allowance = await contract.allowance(wallet.address, contractAddress);
        if (allowance.lt(priceInTokens)) {
            console.log('Insufficient allowance. Approve tokens first.');
            return;
        }*/

        // Richiama la funzione dello smart contract per generare un NFT
        const tx = await contract.mintNFT(priceInTokens, imageURI);
        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
}

// Funzione per stampare l'URI di un NFT tramite il tokenID
async function get_uri(id) {
    try {

        // Richiama la funzione view dello smart contract per ottenere l'URI dell'NFT
        const uri = await contract.getImageURI(id);
        console.log('URI: ', uri);  // Dovrebbe stampare direttamente la URI
    } catch (error) {
        console.error('Errore:', error);
    }
}

// Definire la funzione per mettere in vendita un NFT
async function sale_nft() {
    try {

        // Richiama la funzione dello smart contract per mettere in vendita un NFT
        const tx = await contract.listNFTForSale(1, 10)
        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt.hash);
    } catch (error) {
        console.error('Errore:', error);
    }
}

// Definire la funzione per comprare NFT
async function buy_nft(id) {
    try {

        // Richiama la funzione dello smart contract per acquistare NFT
        const tx = await contract.buyNFT(id)
        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt.hash);
        console.log('NFT bought successfully!');
    } catch (error) {
        console.error('Errore:', error);
    }
}

//mint_NFT();
get_uri(1);
//sale_nft();
//buy_nft(1);
//updateBalance();

// Esporta le funzioni
module.exports = { buyToken, reward, sell, buy_nft }