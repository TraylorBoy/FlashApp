require("dotenv").config(); // Access environment variables
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(process.env.WALLET_KEY, process.env.KOVAN_URL);
      },
      network_id: "42"
    }
  },
  compilers: {
    solc: {
      version: "0.6.12",
      settings:{
        optimizer:{
          enabled: true
        }
      }
    },
  }
};
