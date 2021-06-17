var FlashApp = artifacts.require("./FlashApp.sol");

// Provider address - Kovan: 0x88757f2f99175387aB4C6a4b3067c77A695b0349
module.exports = function(deployer) {
  deployer.deploy(FlashApp, "0x88757f2f99175387aB4C6a4b3067c77A695b0349");
};
