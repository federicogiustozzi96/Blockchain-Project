const forwarerOrigin = 'http://localhost:5000';

const initialize = () => {

    const connectButton = Document.getElementById('connectWallet');
    const {ethereum} = window;

    const onboardMetamaskClient = async() => {
        if(!isMetamaskInstalled()) {
            //prompt the user to install it
            console.log("Metamask is not installed");
            connectButton.value = "Click here to install Metamask";
            connectButton.onclick = installMetamask;
        } else {
            console.log("Metamask is installed correctly");
            connectButton.onclick = connectMetamask;
        }
    }

    const connectMetamask = async () => {
        connectButton.disabled = true;
        try {
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            connectButton.value = "Connected";
            console.log("accounts: ", accounts)
            connectButton.disabled = false;
        } catch(err) {
            console.error("error occurred while connecting to Metamask: ", err)
        }    
    }

    const isMetamaskInstalled = () => {
        return ethereum && ethereum.isMetamask;
    }

    const installMetamask = () => {
        const onboarding = new MetamaskOnboarding({ forwarerOrigin })
        connectButton.value = "Installation in progress";
        connectButton.disabled = true;
        onboarding.startOnboarding();
    }

    onboardMetamaskClient();
};

window.addEventListener('DOMContentLoaded', initialize);
