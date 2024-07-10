//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

//Questa direttiva indica al compilatore di utilizzare la versione 0.8.24 di Solidity o successiva, ma non una versione maggiore di 0.9.0.
//This directive tells the compiler to use Solidity version 0.8.24 or later, but not a version greater than 0.9.0.
pragma solidity ^0.8.24;


// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    //Nome e simbolo Token
    string public name = "Donuts";
    string public symbol = "DNT";

    // The fixed amount of tokens, stored in an unsigned integer type variable.
    //rappresenta la quantità totale di token che esistono nel sistema. 
    //È una parte fondamentale di qualsiasi token ERC20-like, perché definisce quanti token sono stati creati e devono essere gestiti dal contratto. 
    //totalSupply stabilisce la quantità totale di token che esistono fin dall'inizio e non può essere cambiata. 
    //Questo aiuta a prevenire l'inflazione del token. Inizializzato a 1.000.000 token e assegnato interamente all'indirizzo che deploya il contratto (di solito il creatore). 
    //E' una variabile pubblica, chiunque può visualizzarla. Questo aumenta la trasparenza, permettendo a chiunque di vedere quanti token esistono in totale.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Buy(address indexed buyer, uint256 amount); 

    uint256 public rate = 100; // Example rate: 1 ETH = 100 tokens

    /**
     * Contract initialization.
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from *outside*
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false`, the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    function buyTokens() external payable {
        uint256 amountToBuy = msg.value * rate;
        require(amountToBuy > 0, "You need to send some Ether");
        require(balances[owner] >= amountToBuy, "Not enough tokens available");
        
        // Transfer the tokens to the buyer
        balances[owner] -= amountToBuy;
        balances[msg.sender] += amountToBuy;

        // Emit an event
        emit Transfer(owner, msg.sender, amountToBuy);
        emit Buy(msg.sender, amountToBuy);  
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * Allow the owner to withdraw Ether from the contract.
     */
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}