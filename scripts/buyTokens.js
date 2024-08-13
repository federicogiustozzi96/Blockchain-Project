const { ethers } = require('ethers');
require("dotenv").config();

// Configura la connessione al provider di Hardhat
const provider = ethers.getDefaultProvider('http://127.0.0.1:8545');

// Chiave privata dell'account che eseguirà la transazione
// Nota: Hardhat solitamente fornisce account preconfigurati con chiavi private, puoi prenderne una da lì
const privateKey = process.env.PRIVATE_KEY;

// Creare un'istanza del wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Indirizzo del contratto e ABI
const contractAddress = '0xc00a33bA150D8F62788887A80db30110Cc90Cd69';
const contractABI = [
    // L'ABI dovrebbe includere la definizione della funzione buyTokens
    "function buyTokens(uint256 amount) public payable"
];

// Creare un'istanza del contratto
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Definire la funzione per acquistare i token
async function buyTokens(amount) {
    // Imposta il valore che vuoi inviare (ad esempio, 1 ETH)
    const valueToSend = ethers.parseEther('1.0');

    try {
        // Eseguire la transazione chiamando la funzione buyTokens
        const tx = await contract.buyTokens(amount, { value: valueToSend });
        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt.transactionHash);
    } catch (error) {
        console.error('Error buying tokens:', error);
    }
}

// Esegui la funzione
//buyTokens(1000); // Sostituisci 1000 con l'importo di token che desideri acquistare

module.exports = { buyTokens }