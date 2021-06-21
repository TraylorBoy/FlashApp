// FlashApp Contract
// - Setup script intended to be used with the FlashApp API (flashappi)
// author: Marques Traylor
const Contract = require('web3-eth-contract');
const _abi = require('./contracts/FlashApp.json');

// Setup contract instance
const setup = async (provider, address) => {
  console.log('Creating FlashApp contract');
  Contract.setProvider(provider);

  return new Contract(_abi, address);
}

module.exports = FlashApp = async (provider, address) => {
  const flashApp = await setup(provider, address);

  return flashApp;
}
