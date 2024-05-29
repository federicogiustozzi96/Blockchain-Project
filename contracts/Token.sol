//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloToken {

    //indirizzo del possessore del contratto
    address public owner;

    //indirizzo del miner
    address public minter;

    //bilancio in token dei vari utenti
    //bilancio = {indirizzo => #token}
    mapping (address => uint) balance;

    //prezzo del token
    uint public constant PRICE = 2 * 1e15;

    constructor() {
        minter = msg.sender;
    }

    //modificatore onlyOwner: solo il possessore del contratto può utilizzare le funzioni con questo modificatore
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //funzione per vedere quanti token possiedo
    function getValue() public view returns(uint) {
        return balance[msg.sender];
    }

    //funzione per far vendere uno o più token dagli utenti
    function sendViaCall(address payable _to, uint n_token) public payable onlyOwner {
        // Call returns a boolean value indicating success or failure
        // Pays user for each token sold
        (bool sent, bytes memory data) = _to.call{value:n_token*PRICE}("");
        require(sent, "Failed to send Ether");
        balance[_to] -= n_token;
        (data);
    }

    //funzione per dare token reward ad un utente
    function reward(uint n_token) public {
        balance[msg.sender] += n_token;
    }

    //funzione per acquistare token
    function mint() public payable {
        require(msg.value >= PRICE, "Not enough currency to buy a token!");
        balance[msg.sender] += msg.value / PRICE;
    }

    //funzione per trasferire token ad un altro utente
    function transfer(uint amount, address to) public {
        require(balance[msg.sender] >= amount, "Not enough tokens!");
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }

    //funzione per chiudere il contratto (solo chi l'ha invocato può chiuderlo)
    function terminate() public {
        require(msg.sender == minter, "You cannot terminate the contract!");
        payable(minter).transfer(address(this).balance);
    }

}