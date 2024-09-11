Prerequisites
=============
Ensure you have the following installed on your system before proceeding with the setup:

- Node.js (v14.x or higher)
- npm (Node package manager, which comes with Node.js)
- MySQL (for database operations)
- XAMPP (optional, for easy MySQL management via phpMyAdmin)

INSTALL DEPENDENCIES
=====================
The project requires various dependencies listed in the package.json file. Use npm to install them:

```
npm install
```

This will install the following main dependencies:

- Express: For the backend server (`express`)
- hbs: For handling views using Handlebars (`hbs`)
- dotenv: For managing environment variables (`dotenv`)
- MySQL: To connect to the MySQL database (`mysql`)
- Ethers.js: To interact with the Ethereum blockchain (`ethers`)
- Web3.js: An additional library to interact with Ethereum (`web3`)
- IPFS HTTP Client: To interact with IPFS for decentralized storage (`ipfs-http-client`)
- @openzeppelin/contracts: A library for secure and reusable smart contracts

INSTALL DEVELOPER TOOLS AND TESTING LIBRARIES
=============================================
In addition to the core dependencies, the following developer dependencies and testing tools are necessary:

```
npm install --save-dev chai mocha hardhat @nomicfoundation/hardhat-toolbox
```

This will install:

- Chai: For testing smart contracts with assertions (`chai`)
- Mocha: As a testing framework (`mocha`)
- Hardhat: For compiling, deploying, and testing smart contracts (`hardhat`)
- Hardhat Toolbox: Includes various tools for smart contract interaction and testing (`@nomicfoundation/hardhat-toolbox`)

CONFIGURE ENVIRONMENT VARIABLES
===============================
Create a `.env` file in the root directory of the project and add the necessary environment variables. Below is a template for the `.env` file:

```
PRIVATE_KEY=<Your_Private_Key>
MYSQL_USER=<Your_MySQL_Username>
MYSQL_PASSWORD=<Your_MySQL_Password>
MYSQL_DATABASE=<Your_Database_Name>
```

SETUP MYSQL DATABASE
=====================
You need a running MySQL database for this project. Follow these steps to set it up:

- Install XAMPP or any other MySQL service.
- Open phpMyAdmin or your preferred MySQL management tool.
- Create a new database (e.g., `blockchain_dapp`) and upload the database schema that can be found in the database folder in the project.
  ```bash
  mysql -u <username> -p <database_name> < path_to_sql_file.sql
  ```
- Update the `.env` file with the database name, username, and password.

RUNNING THE PROJECT
===================
To start the backend server, run the following:

```
npm run dev
```

This will start the Express server with **Nodemon** for automatic restarts on file changes.

To deploy and test smart contracts using Hardhat:

1. Compile the smart contracts:

```
npx hardhat compile
```

2. Run the local Hardhat network:

```
npx hardhat node
```

3. Deploy the contracts:

```
npx hardhat run scripts/deployToken.js --network donutsNetwork
```

TESTING SMART CONTRACTS
========================
The project uses **Chai** for testing smart contracts. Run the tests using Hardhat:

```
npx hardhat test
```

METAMASK SETUP
==============
- Install the MetaMask extension in your browser.
- Create or import an Ethereum wallet.
- Connect MetaMask to the local Hardhat network or any test network you are using.
- Make sure to configure MetaMask to use the private key and wallet details provided in your `.env` file.