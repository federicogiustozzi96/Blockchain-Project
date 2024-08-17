const { create } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');

async function main() {
    // Configura il client IPFS
    const ipfs = create({ 
        url: 'https://ipfs.infura.io:5001'
    });

    // Leggi il file immagine (sostituisci 'path/to/image.png' con il percorso del tuo file)
    const filePath = path.join(__dirname, 'nft1.png');
    const file = fs.readFileSync(filePath);
    
    // Carica il file su IPFS
    const result = await ipfs.add(file);

    console.log('File caricato su IPFS con CID:', result.path);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
