require("dotenv").config();
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
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.KEY],
          providerOrUrl: process.env.PROVIDER,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/"
        })
      },
      network_id: "42",
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.6.6",
      settings:{
        optimizer:{
          enabled: true
        }
      }
    },
  }
};
