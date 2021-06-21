// FlashApp Wallet
// - Setup script intended to be used with the FlashApp API (flashappi)
// author: Marques Traylor
const Web3 = require('web3');
const BN = require('bn.js');

let props = {
  _web3: null,
  _provider: null,
  address: '',
  funds: new BN(0),
  flash_config: {}
};

// Setup wallet instance
const setup = async (config, provider, port) => {
  console.log('Unpacking config');
  // Unpack LOAN_SETTINGS sent from client
  props._web3 = new Web3(provider | 'ws://localhost:' + port);
  props._provider = provider | 'ws://localhost:' + port;
  props.address = config.WALLET.address;
  props.funds = new BN(config.WALLET.balance);

  props.flash_config.reserve = config.TOKEN;
  props.flash_config.amount = new BN(config.LOAN_AMOUNT);
  props.flash_config.fee = new BN(config.DEPOSIT_AMOUNT);

  return props;
};

module.exports = Wallet = async (config, provider=null, port=3000) => {
  const wallet = await setup(config, provider, port);

  return wallet;
};
