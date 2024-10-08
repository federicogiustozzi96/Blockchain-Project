let input1 = document.getElementById("input1") 
let risultato = document.getElementById("risultato1")
let buyButton = document.getElementById("buttonBuy")
let sellButton = document.getElementById("buttonSell")
let regex = /^[a-zA-Z]+$/; 
let buy = null
let sell = null

const checkWalletUrl = 'http://localhost:5000/verifyWallet';
let isWalletConnected = false;

const checkWalletConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) {
                const account = accounts[0];
                const response = await fetch(checkWalletUrl + '?address=' + encodeURIComponent(account));
                if (response.ok) {
                    const data = await response.json();
                    isWalletConnected = data.username ? true : false;
                } else {
                    throw new Error("Server error while checking wallet");
                }
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
            alert("Error occurred while checking wallet connection.");
        }
    } else {
        alert("MetaMask is not installed.");
    }
};

const handleBuyClick = (event) => {
    if (!isWalletConnected) {
        event.preventDefault();
        alert("Please connect your wallet with MetaMask before proceeding.");
    } else {
        buyContract();
    }
};

const handleSellClick = (event) => {
    if (!isWalletConnected) {
        event.preventDefault();
        alert("Please connect your wallet with MetaMask before proceeding.");
    } else {
        sellContract();
    }
};

const setupEventListeners = () => {
    buyButton.addEventListener("click", handleBuyClick);
    sellButton.addEventListener("click", handleSellClick);
};

const monitorWalletDisconnection = () => {
    setInterval(async () => {
        const { ethereum } = window;
        if (ethereum) {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0 && isWalletConnected) {
                alert("Wallet disconnected. The page will reload.");
                window.location.reload();
            }
        }
    }, 3000);
};

const initialize = async () => {
    await checkWalletConnection();
    setupEventListeners();
    monitorWalletDisconnection();
};

window.addEventListener('DOMContentLoaded', initialize);

input1.addEventListener("input", Buy);

function buyContract() {
    if (buy != null) {
        fetch("/buy", { 
            method: "POST", 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ "price": buy }) 
        });
        buy = null;
    }
}

function sellContract() {
    if (sell != null) {
        fetch("/sell", { 
            method: "POST", 
            headers: { 
                'Content-Type': 'application/json', 
            }, 
            body: JSON.stringify({ "price": sell }) 
        });
        sell = null;
    }
}

let input2 = document.getElementById("input2") 
let risultato2 = document.getElementById("risultato2")

input2.addEventListener("input", Sell);

function Buy(e) {   
    let flag = /^\d+$/.test(e.target.value)
    risultato.innerHTML = "";
    if (e.target.value == "")
        risultato.innerHTML = "<p><p>" 
    else if (!flag && !(e.target.value.includes("."))) {   
        risultato.innerHTML = "<p id=\"invalid\">invalid input<p>" 
    } else if (e.target.value < 1)
        risultato.innerHTML = "<p id=\"minimum\">Minimum of 1 Donuts<p>" 
    else {
        risultato.innerHTML = "<p id=\"valid\">≅ "+ e.target.value / 1000000 +" ETH<p>" 
        buy = e.target.value / 1000000;
    }
}

function Sell(e) {   
    let flag = /^\d+$/.test(e.target.value)
    risultato2.innerHTML = "";
    if (e.target.value == "")
        risultato2.innerHTML = "<p><p>" 
    else if (!flag && !(e.target.value.includes("."))) {   
        risultato2.innerHTML = "<p id=\"invalid\">invalid input<p>" 
    } else if (e.target.value < 1)
        risultato2.innerHTML = "<p id=\"minimum\">Minimum of 0.001 ETH<p>" 
    else {
        risultato2.innerHTML = "<p id=\"valid2\">≅ " + e.target.value / 1000000 + " ETH<p>"
        sell = e.target.value;
    }
}
