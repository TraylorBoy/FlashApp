// FlashApp Wallet
// - Setup script intended to be used with the FlashApp API (flashappi)
// author: Marques Traylor
const Web3 = require('web3');
const BN = require('bn');

let props = {
  _web3: null,
  address: '',
  funds: new BN(0),
  flash_config: {}
};

// Setup method
const Wallet = async (config, provider, port) => {
  // Unpack LOAN_SETTINGS sent from client
  props._web3 = new Web3(provider | 'ws://localhost:' + port);
  props.address = config.ADDRESS;
  props.funds = new BN(config.BALANCE);

  props.flash_config.reserve = config.TOKEN;
  props.flash_config.amount = new BN(config.LOAN_AMOUNT);
  props.flash_config.fee = new BN(config.DEPOSIT_AMOUNT);

  return props;
};

export default async (config, provider=null, port=3000) => {
  const wallet = await Wallet(config, provider, port);

  return wallet;
};
