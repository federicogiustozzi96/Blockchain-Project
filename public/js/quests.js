const checkWalletUrl = 'http://localhost:5000/verifyWallet';
let isWalletConnected = false;

const initialize = () => {
    const connectButton = document.getElementById('connectWallet');
    const { ethereum } = window;

    const onboardMetaMaskClient = async () => {
        if (!isMetamaskInstalled()) {
            console.log("MetaMask is not installed :(");
            connectButton.value = "Click here to install MetaMask";
            connectButton.onclick = installMetaMask;
        } else {
            console.log("MetaMask is installed!");
            connectButton.onclick = connectMetaMask;
        }
    };

    const connectMetaMask = async () => {
        connectButton.disabled = true;
    
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
            if (Array.isArray(accounts) && accounts.length > 0) {
                const account = accounts[0];
                console.log("Wallet address:", account);
                
                const response = await fetch(checkWalletUrl + '?address=' + encodeURIComponent(account));
    
                if (!response.ok) {
                    const text = await response.text();
                    console.error("Server returned error:", text);
                    alert("Error occurred while checking wallet: " + text);
                    return;
                }
    
                let data;
                try {
                    data = await response.json();
                } catch (err) {
                    console.error("Error parsing JSON response:", err);
                    alert("Error parsing JSON response: " + err.message);
                    return;
                }
    
                if (data.username) {
                    alert(`Wallet ${account} connected as username ${data.username}`);
                    isWalletConnected = true;  // Segnala che il wallet è connesso
                } else {
                    alert("No username associated with this wallet. Please register first.");
                }
            } else {
                alert("No accounts found");
            }
        } catch (err) {
            console.error("Error occurred while connecting to MetaMask: ", err);
            alert("Error occurred: " + err.message);
        } finally {
            connectButton.disabled = false;
        }
    };

    const checkWalletStatus = async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (Array.isArray(accounts) && accounts.length > 0) {
                const account = accounts[0];
                const response = await fetch(checkWalletUrl + '?address=' + encodeURIComponent(account));
    
                if (response.ok) {
                    const data = await response.json();
                    if (data.username) {
                        if (!isWalletConnected) {
                            isWalletConnected = true;
                            console.log(`Wallet ${account} is already connected as username ${data.username}`);
                        }
                    }
                }
            } else {
                if (isWalletConnected) {
                    isWalletConnected = false;
                    alert("Wallet disconnected. Please reconnect your wallet.");
                    location.reload();  // Ricarica la pagina
                }
            }
        } catch (err) {
            console.error("Error checking wallet status: ", err);
            isWalletConnected = false;  // In caso di errore, considera il wallet come disconnesso
        }
    };

    const startWalletStatusCheck = () => {
        setInterval(checkWalletStatus, 3000); // Controlla lo stato del wallet ogni 3 secondi
    };

    const isMetamaskInstalled = () => {
        return ethereum && ethereum.isMetaMask;
    };

    const installMetaMask = () => {
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
        connectButton.value = "Installation in progress";
        connectButton.disabled = true;
        onboarding.startOnboarding();
    };

    const checkWalletConnection = (event) => {
        if (!isWalletConnected) {
            event.preventDefault();  // Blocca la navigazione
            alert("Please connect your wallet with MetaMask before proceeding.");
        }
    };

    const setupQuestLinks = () => {
        const questLinks = document.querySelectorAll('main article div a');
        questLinks.forEach(link => {
            link.addEventListener('click', checkWalletConnection);
        });
    };

    onboardMetaMaskClient();
    checkWalletStatus();  // Controlla lo stato del wallet all'inizializzazione
    startWalletStatusCheck();  // Inizia a controllare lo stato del wallet a intervalli regolari
    setupQuestLinks();
};

window.addEventListener('DOMContentLoaded', initialize);
