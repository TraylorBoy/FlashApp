var FlashApp = artifacts.require("./FlashApp.sol");

// TODO: Add provider address
module.exports = function(deployer) {
  deployer.deploy(FlashApp);
};
