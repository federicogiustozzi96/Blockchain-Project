const forwarderOrigin = 'http://localhost:5000';
const serverUrl = 'http://localhost:5000/address';
const registerUserUrl = 'http://localhost:5000/registerUser';
const checkWalletUrl = 'http://localhost:5000/verifyWallet';

// Variabile che traccia il collegamento del wallet (MetaMask)
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
            console.log("MetaMask is installed Hurray!!!!!");
            await checkIfWalletConnected();
            connectButton.onclick = connectMetaMask;
        }
    };

    const checkIfWalletConnected = async () => {
        try {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (Array.isArray(accounts) && accounts.length > 0) {
                const account = accounts[0];
                const response = await fetch(checkWalletUrl + '?address=' + encodeURIComponent(account));

                if (response.ok) {
                    const data = await response.json();
                    isWalletConnected = true;
                    console.log("Wallet already connected.");
                    alert(`Wallet ${account} already connected as ${data.username}`);
                    connectButton.disabled = true;
                    connectButton.value = "Connected";
                } else {
                    isWalletConnected = false;
                    console.log("Wallet is not connected.");
                }
            } else {
                isWalletConnected = false;
                console.log("Wallet is not connected.");
            }
        } catch (err) {
            console.error("Error checking wallet connection: ", err);
            isWalletConnected = false;
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
                    isWalletConnected = true;
                    alert(`Wallet ${account} connected as ${data.username}`);
                } else {
                    let username = "";
                    while (!username) {
                        username = prompt("This is the first time this wallet is used. Please enter a username to associate with this wallet:");
                        if (!username) {
                            alert("Username cannot be empty. Please enter a valid username.");
                        }
                    }

                    const registrationResponse = await fetch(registerUserUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ address: account, username: username }),
                    });

                    if (!registrationResponse.ok) {
                        const text = await registrationResponse.text();
                        console.error("Server returned error:", text);
                        alert("Error occurred during user registration: " + text);
                        return;
                    }

                    let registrationData;
                    try {
                        registrationData = await registrationResponse.json();
                    } catch (err) {
                        console.error("Error parsing JSON response:", err);
                        alert("Error parsing JSON response: " + err.message);
                        return;
                    }

                    if (registrationResponse.ok) {
                        isWalletConnected = true;
                        alert(`Wallet ${account} successfully associated with username ${username}`);
                    } else {
                        alert(`Error: ${registrationData.error}`);
                    }
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
            isWalletConnected = false;
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

    // Controlla se il wallet di MetaMask è connesso
    const checkWalletConnection = (event) => {
        if (!isWalletConnected) {
            event.preventDefault();
            alert("Please connect your wallet with MetaMask before proceeding.");
        }
    };

    // Abilita la navigazione ai minigiochi se e soltanto se il wallet è connesso
    const setupGameLinks = () => {
        console.log("entered setupGameLinks");
        const gameLinks = document.querySelectorAll('.name a');
        gameLinks.forEach(link => {
            link.addEventListener('click', checkWalletConnection);
        });
    };

    onboardMetaMaskClient();
    checkWalletStatus();  // Controlla lo stato del wallet all'inizializzazione
    startWalletStatusCheck();  // Inizia a controllare lo stato del wallet a intervalli regolari
    setupGameLinks();
};

window.addEventListener('DOMContentLoaded', initialize);
