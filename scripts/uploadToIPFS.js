import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    // Connetti al nodo IPFS locale
    const ipfs = create({ url: 'http://localhost:5001' });

    const filePath = path.join(__dirname, 'nft1.png');
    const file = fs.readFileSync(filePath);
    
    const result = await ipfs.add(file);

    console.log('File caricato su IPFS con CID:', result.path);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });