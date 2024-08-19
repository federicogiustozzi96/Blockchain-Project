const forwarderOrigin = 'http://localhost:5000';
const serverUrl = 'http://localhost:5000/address'; 

const initialize = () => {
    const connectButton = document.getElementById('connectWallet');
    const { ethereum } = window;

    const onboardMetaMaskClient = async () => {
        if (!isMetamaskInstalled()) {
            console.log("MetaMask is not installed :(");
            connectButton.value = "Click here to install MetaMask";
            connectButton.onclick = installMetaMask;
        } else {
            console.log("MetaMask is installed Hurray!!!!!");
            connectButton.onclick = connectMetaMask;
        }
    }

    const connectMetaMask = async () => {
        connectButton.disabled = true;
        try {

            const username = prompt("Please enter your username:");
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            
            if (Array.isArray(accounts) && accounts.length > 0) {
                const account = accounts[0]; 
                console.log("Wallet address:", account); 
                alert("Wallet address: " + account); 
                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({address: account, username: username }),
                });
            } else {
                console.log("No accounts found");
                alert("No accounts found");
            }

            connectButton.value = "Connected";
        } catch (err) {
            console.error("Error occurred while connecting to MetaMask: ", err);
            alert("Error occurred: " + err.message); 
        } finally {
            connectButton.disabled = false;
        }
    }

    const isMetamaskInstalled = () => {
        return ethereum && ethereum.isMetaMask;
    }

    const installMetaMask = () => {
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
        connectButton.value = "Installation in progress";
        connectButton.disabled = true;
        onboarding.startOnboarding();
    }

    onboardMetaMaskClient();
};

window.addEventListener('DOMContentLoaded', initialize);
