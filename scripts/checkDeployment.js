require('dotenv').config(); // Importa il file .env
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; // Carica l'indirizzo del contratto dal file .env
  const contractName = "Token"; // Nome del contratto preso dal file .sol

  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS not set in .env file");
    return;
  }

  // Assicurati che il contratto sia stato compilato
  const Contract = await hre.ethers.getContractFactory(contractName);

  try {
    const contract = await Contract.attach(contractAddress);
    console.log(`${contractName} is deployed at:`, contract.address);
  } catch (error) {
    console.error("Failed to attach to contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
