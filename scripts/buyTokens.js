const { ethers } = require('ethers');
require("dotenv").config();

// Configura la connessione al provider di Hardhat
const provider = ethers.getDefaultProvider('http://127.0.0.1:8545');

// Chiave privata dell'account che eseguirà la transazione
// Nota: Hardhat solitamente fornisce account preconfigurati con chiavi private, puoi prenderne una da lì
const privateKey = process.env.PRIVATE_KEY_1;

// Creare un'istanza del wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Indirizzo del contratto e ABI
const contractAddress = '0x8Eaa0092BA008925f796E558c1C25aaC478a8F14';
const contractABI = [
    // L'ABI dovrebbe includere la definizione della funzione buyTokens
    "function buyTokens(uint256 amount) public payable",
    "function reward(uint256 amountToReward) external"
];

// Creare un'istanza del contratto
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Definire la funzione per acquistare i token 
async function buyTokens(amount) {
    // Imposta il valore che vuoi inviare (ad esempio, 1 ETH)
    const valueToSend = ethers.parseEther(amount);

    try {
        // Eseguire la transazione chiamando la funzione buyTokens
        const tx = await contract.buyTokens({ value: valueToSend });
        console.log('Transaction sent:', tx.hash);

        // Attendere la conferma della transazione        
        const receipt = await tx.wait();
        console.log('Transaction mined:', receipt.hash);
    } catch (error) {
        console.error('Error buying tokens:', error);
    }
}

// Definire la funzione per richiamare la funzione reward
async function reward(amountToReward) {
    try {
        // Eseguire la transazione chiamando la funzione reward
        const tx = await contract.reward(amountToReward);
        console.log('Reward transaction sent:', tx.hash);

        // Attendere la conferma della transazione
        const receipt = await tx.wait();
        console.log('Reward transaction mined:', receipt.hash);
    } catch (error) {
        console.error('Error executing reward:', error);
    }
}

// Esporta la funzione
module.exports = { buyTokens, reward }