require("@nomiclabs/hardhat-waffle");

const { privateKey } = require('./secrets.json');  // Cambia privateKey con tus propios datos

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${privateKey}`]
    }
  },
  solidity: {
    version: "0.8.9",  // Ajusta esto a tu versión de Solidity
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
