var FlashApp = artifacts.require("./FlashApp.sol");

module.exports = function(deployer) {
  deployer.deploy(FlashApp);
};
