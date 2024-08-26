const forwarderOrigin = 'http://localhost:5000';
const serverUrl = 'http://localhost:5000/address';
const registerUserUrl = 'http://localhost:5000/registerUser';
const checkWalletUrl ='http://localhost:5000/verifyWallet';

//variabile che traccia il collegamento del wallet (Metamask)
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
            connectButton.onclick = connectMetaMask;
        }
    }
    
    //FUNZIONE ORIGINALE
    /*const connectMetaMask = async () => {
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
    }*/

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
              const username = prompt("This is the first time this wallet is used. Please enter a username to associate with this wallet:");
    
              if (username) {
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
                  alert(`Wallet ${account} successfully associated with username ${username}`);
                  isWalletConnected = true;  // Segnala che il wallet è connesso
                } else {
                  alert(`Error: ${registrationData.error}`);
                }
              } else {
                alert("Username cannot be empty.");
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

      const isMetamaskInstalled = () => {
        return ethereum && ethereum.isMetaMask;
    }

    const installMetaMask = () => {
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
        connectButton.value = "Installation in progress";
        connectButton.disabled = true;
        onboarding.startOnboarding();
    }

    //Controlla se il wallet di Metamask è connesso
    const checkWalletConnection = (event) => {
      if (!isWalletConnected) {
          event.preventDefault();  // Blocca la navigazione
          alert("Please connect your wallet with MetaMask before proceeding.");
      }
  }
        //abilita la navigazione ai minigiochi se e soltanto se il wallet è connesso
        const setupGameLinks = () => {
          console.log("entered setupGameLinks");
          const gameLinks = document.querySelectorAll('.name a');
          gameLinks.forEach(link => {
              link.addEventListener('click', checkWalletConnection);
          });
      }

    onboardMetaMaskClient();
    setupGameLinks();
};

window.addEventListener('DOMContentLoaded', initialize);
