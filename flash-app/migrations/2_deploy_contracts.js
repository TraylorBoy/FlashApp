var FlashApp = artifacts.require("./FlashApp.sol");

module.exports = function(deployer) {
  deployer.deploy(FlashApp, "0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5");
};
