require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.SEED_PHRASE,
      },
      chainId: 1337
    },
    donutsNetwork: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: {
        mnemonic: process.env.SEED_PHRASE,
      },
    },
  },
};
