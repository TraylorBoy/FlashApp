// FlashApp Contract
// - Setup script intended to be used with the FlashApp API (flashappi)
// author: Marques Traylor
const Contract = require('web3-eth-contract');

let props = {
  _provider: null,
  abi: null,
  address: "",
}

// Setup contract instance
const setup = async (provider, abi, address) => {
  console.log('Creating FlashApp contract');

  // Will be passed to new Contract instance
  props._provider = provider;
  props.abi = abi;
  props.address = address;

  return props;
}

module.exports = FlashApp = async (provider, abi, address) => {
  Contract.setProvider(provder);

  const flashApp = new Contract(abi, address);

  return flashApp;
}
