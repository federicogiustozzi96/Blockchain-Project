//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

//Questa direttiva indica al compilatore di utilizzare la versione 0.8.24 di Solidity o successiva, ma non una versione maggiore di 0.9.0.
//This directive tells the compiler to use Solidity version 0.8.24 or later, but not a version greater than 0.9.0.
pragma solidity ^0.8.24;
import "hardhat/console.sol";

// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    //Nome e simbolo Token
    string public name = "Donut";
    string public symbol = "DNT";

    // The fixed amount of tokens, stored in an unsigned integer type variable.
    //rappresenta la quantità totale di token che esistono nel sistema. 
    //È una parte fondamentale di qualsiasi token ERC20-like, perché definisce quanti token sono stati creati e devono essere gestiti dal contratto. 
    //totalSupply stabilisce la quantità totale di token che esistono fin dall'inizio e non può essere cambiata. 
    //Questo aiuta a prevenire l'inflazione del token. Inizializzato a 1.000.000 token e assegnato interamente all'indirizzo che deploya il contratto (di solito il creatore). 
    //E' una variabile pubblica, chiunque può visualizzarla. Questo aumenta la trasparenza, permettendo a chiunque di vedere quanti token esistono in totale.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    //rappresenta l'indirizzo del proprietario del contratto, ovvero l'indirizzo che ha deployato il contratto. Questa variabile è importante per diverse ragioni:
    address public owner;

    // A mapping is a key/value map. Here we store each account's balance.
    //Serve a tenere traccia del saldo di token di ogni indirizzo Ethereum che interagisce con il contratto.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    //Permette di tracciare le transazioni di token tra gli indirizzi. 
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    //utilizzato per registrare quando un utente acquista token tramite la funzione buyTokens.
    event Buy(address indexed buyer, uint256 amount); 

    uint256 public rate = 1000000000000; // Example rate: 1 ETH = 100 tokens
                          
    /**
     * Contract initialization.
     * parte cruciale del processo di inizializzazione. Viene eseguita una sola volta, quando il contratto viene distribuito (deployato) sulla blockchain.
     * Il costruttore viene utilizzato per assegnare tutti i token iniziali all'indirizzo che distribuisce il contratto e per impostare il proprietario del contratto. 
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        /* Accede alla mappatura balances per l'indirizzo del mittente della transazione (colui che sta deployando il contratto).
        * msg.sender: Una variabile globale che rappresenta l'indirizzo dell'account che ha chiamato la funzione. 
        * Nel caso del costruttore, msg.sender è l'indirizzo che sta distribuendo il contratto.
        */
        balances[msg.sender] = totalSupply; //assegna tutti i token iniziali all'indirizzo del mittente, ossia l'indirizzo del deployer del contratto
        owner = msg.sender; //Imposta l'indirizzo del mittente della transazione (il deployer) come proprietario del contratto.
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from *outside*
     * the contract.
     */
    /**
     * Consente agli utenti di trasferire token da un indirizzo Ethereum a un altro.
     *  prende in input l'indirizzo ethereum 'to' a cui mandare una quantità di Token dettata da 'amount'
     *  'external' indica che la funzione può essere chiamata solo da fuori del contratto, non internamente (off-chain).
     */

    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false`, the
        // transaction will revert.
        // Verifica che il mittente (msg.sender) abbia un saldo sufficiente di token per effettuare il trasferimento.
        require(balances[msg.sender] >= amount, "Not enough tokens"); 

        // Transfer the amount.
        balances[msg.sender] -= amount; // sottrae 'amount' Token dal mittente
        balances[to] += amount;         //trasferisce 'amount' Token al destinatario

        // Notify off-chain applications of the transfer.
        /**
         * serve a emettere un evento Transfer. Gli eventi in Solidity sono meccanismi utilizzati per 
         * Un evento in Solidity è una struttura di dati che permette ai contratti di emettere log che possono essere catturati dalle applicazioni off-chain,
         * come le DApp (Decentralized Applications) o altre piattaforme di monitoraggio. 
         * Gli eventi non influenzano lo stato del contratto, ma vengono registrati nella blockchain e possono essere utilizzati per tracciare le attività del contratto.
         */
        emit Transfer(msg.sender, to, amount); 
    }

    /**
     * Consente agli utenti di acquistare token inviando Ether al contratto.
     * il modificatore external indica che la funzione può essere chiamata solo da fuori del contratto, non internamente.
     * Il modificatore payable permette alla funzione di ricevere Ether.
     */
    function buyTokens() external payable {

        /**Calcola la quantità di token che l'utente riceverà in cambio dell'Ether inviato.
         * msg.value: La quantità di Ether inviata nella transazione.
         * rate: La variabile che rappresenta il tasso di conversione da Ether a token (ad esempio, 1 Ether = 100 token).
         */
        //console.log("Value: ", msg.value);
        uint256 amountToBuy = msg.value / rate;
        //console.log("Amount to buy: ", amountToBuy);
        /**
         * Verifica che l'importo di token calcolato sia maggiore di zero. 
         * Se non è così, la transazione viene annullata con il messaggio "You need to send some Ether".
         */
        require(amountToBuy > 0, "You need to send some Ether");
        /**
         * Controlla se il proprietario del contratto ha un saldo sufficiente di token per completare la transazione. 
         * Se non ci sono abbastanza token, la transazione viene annullata con il messaggio "Not enough tokens available".
         */
        require(balances[owner] >= amountToBuy, "Not enough tokens available");
        
        // Transfer the tokens to the buyer
        balances[owner] -= amountToBuy; //Deduce l'importo dei token dal saldo del proprietario del contratto.
        balances[msg.sender] += amountToBuy; // Aggiunge l'importo dei token al saldo dell'acquirente.
        //console.log("Indirizzo utente: ", msg.sender);
        //console.log("Bilancio token utente: ", balances[msg.sender]);

        // Emit an event
        /**
         * Emissione dell'evento Transfer per notificare che i token sono stati trasferiti dal proprietario all'acquirente. 
         */
        emit Transfer(owner, msg.sender, amountToBuy);
        /**
         * Emissione dell'evento Buy per notificare che l'acquirente ha acquistato token.
         */
        emit Buy(msg.sender, amountToBuy);  
    }

    /**
     * Consente agli utenti di vendere i propri token in cambio di Ether.
     * Il modificatore external indica che la funzione può essere chiamata solo da fuori del contratto, non internamente.
     */
    function sellToken(uint256 amountToSell) external {
        // Assicurati che l'utente abbia abbastanza token da vendere.
        require(balances[msg.sender] >= amountToSell, "Not enough tokens to sell");

        // Calcola l'importo di Ether da restituire all'utente.
        uint256 etherAmount = amountToSell * rate;

        // Verifica che il contratto abbia abbastanza Ether per effettuare l'acquisto.
        require(address(this).balance >= etherAmount, "Not enough Ether in the contract");

        // Deduce l'importo dei token dal saldo del venditore.
        balances[msg.sender] -= amountToSell;

        // Aggiunge l'importo dei token al saldo del proprietario del contratto.
        balances[owner] += amountToSell;

        // Trasferisce l'importo di Ether calcolato al venditore.
        payable(msg.sender).transfer(etherAmount);

        // Emissione dell'evento Transfer per notificare che i token sono stati trasferiti dal venditore al proprietario.
        emit Transfer(msg.sender, owner, amountToSell);
    }

    // Funzione utilizzata per ricompensare chi ottiene un buon punteggio sui giochi o sulle quest
    function reward(uint256 amountToReward) external {
        require(balances[owner] >= amountToReward, "Not enough tokens available");

        // Transfer the tokens to the winner
        balances[owner] -= amountToReward; //Deduce l'importo dei token dal saldo del proprietario del contratto.
        balances[msg.sender] += amountToReward; // Aggiunge l'importo dei token al saldo dell'acquirente.

        //Emissione dell'evento Transfer per notificare che i token sono stati trasferiti dal proprietario all'acquirente.
        emit Transfer(owner, msg.sender, amountToReward);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     * 
     * Accede al mapping balances per ottenere il saldo di token dell'account specificato.
     * il modificatore view indica che la funzione non modifica lo stato del contratto. Permette solo di leggere i dati dallo stato del contratto.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * Allow the owner to withdraw Ether from the contract.
     * Consente al proprietario del contratto di prelevare tutti gli Ether presenti nel contratto.
     */
    function withdraw() external {

        //verifica che il mittente della transazione (msg.sender) sia il proprietario del contratto (owner).
        require(msg.sender == owner, "Only the owner can withdraw funds");
        /**
         * +payable(owner)': Converte l'indirizzo del proprietario in un tipo pagabile, consentendo il trasferimento di Ether.
         * '.transfer(address(this).balance)': Trasferisce l'intero saldo di Ether del contratto all'indirizzo del proprietario.
         * 'address(this).balance': Restituisce il saldo corrente di Ether detenuto dal contratto. 'address(this)' si riferisce infatti all'indirizzo del contratto
         */
        payable(owner).transfer(address(this).balance);
    }

    // Per ricevere Ether senza chiamare una specifica funzione
    receive() external payable {
        // codice opzionale da eseguire quando il contratto riceve Ether
    }

    // Funzione di fallback, chiamata quando non viene trovato il selettore di funzione
    fallback() external payable {
        // codice opzionale
    }

    //---------------------------------------------------------------------------------------//
    // gestione NFT
    //---------------------------------------------------------------------------------------//


    // Definizione dei campi degli NFT
    struct NFT {
        uint256 tokenId;
        address owner;
        uint256 price;
        bytes32 imageHash; // Aggiunta dell'hash dell'immagine
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => NFT) public nfts;

    event NFTMinted(uint256 indexed tokenId, address indexed owner);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event NFTListedForSale(uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    // Funzione per generare nuovi NFT tramite l'hash dell'immagine e il prezzo
    function mintNFT(uint256 price, bytes32 imageHash) external {
        uint256 tokenId = nextTokenId;
        nfts[tokenId] = NFT(tokenId, msg.sender, price, imageHash);
        nextTokenId += 1;
        emit NFTMinted(tokenId, msg.sender);
    }

    // funzione per trasferire gli NFT ad altri utenti
    function transferNFT(uint256 tokenId, address to) external {
        require(nfts[tokenId].owner == msg.sender, "You are not the owner of this NFT");
        nfts[tokenId].owner = to;
        emit NFTTransferred(tokenId, msg.sender, to);
    }

    // funzione per mostrare il prezzo di un dato NFT che possiedi
    function listNFTForSale(uint256 tokenId, uint256 price) external {
        require(nfts[tokenId].owner == msg.sender, "You are not the owner of this NFT");
        nfts[tokenId].price = price;
        emit NFTListedForSale(tokenId, price);
    }

    // Funzione per acquistare NFT
    function buyNFT(uint256 tokenId) external {
        NFT storage nft = nfts[tokenId];
        require(nft.price > 0, "This NFT is not for sale");
        require(balances[msg.sender] >= nft.price, "Not enough tokens to buy this NFT");

        balances[msg.sender] -= nft.price;
        balances[nft.owner] += nft.price;

        emit Transfer(msg.sender, nft.owner, nft.price);

        nft.owner = msg.sender;
        nft.price = 0; // Remove from sale

        emit NFTSold(tokenId, msg.sender, nft.price);
    }

    function getImageHash(uint256 tokenId) external view returns (bytes32) {
        return nfts[tokenId].imageHash;
    }

}