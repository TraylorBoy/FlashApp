var FlashAppV2 = artifacts.require("./FlashAppV2.sol");

module.exports = function(deployer) {
  deployer.deploy(FlashAppV2, "0x88757f2f99175387ab4c6a4b3067c77a695b0349");
};
