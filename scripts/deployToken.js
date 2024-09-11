// scripts/deployToken.js

/**
 * dichiarata come asincrona (async) perché contiene operazioni asincrone come il deploy del contratto.
 */
async function main() {

    /**
     * Utilizza ethers.getSigners() per ottenere un array di signers (firmatari). 
     * In questo caso, estrae il primo elemento (il deployer) e lo assegna alla variabile deployer.
     */
    const [deployer] = await ethers.getSigners();

    //Stampa sull'output la stringa "Deploying contracts with the account:" seguita dall'indirizzo del deployer.
    console.log("Deploying contracts with the account:", deployer.address);

    /**
     * Utilizza ethers.getContractFactory() per ottenere un'istanza della factory (struttura utilizzata per creare istanze di un contratto su Ethereum) del 
     * contratto Token dal compilatore di Solidity.
     */
    const Token = await ethers.getContractFactory("Token");

    /**
     *  Esegue il deploy del contratto utilizzando il metodo .deploy() della factory ottenuta precedentemente. 
     * Questo comando effettivamente carica il contratto sulla blockchain.
     */
    const token = await Token.deploy();

    // Stampa l'indirizzo del contratto deployato
    console.log("Token deployed to:", token.target); 
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });