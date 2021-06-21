// TODO: Response errors
require('dotenv').config();
const Wallet = require('./core/wallet.js');
const FlashApp = require('./core/contract.js');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web3 provider (i.e. INFURA) & Contract address
const URL = process.env.URL;
const ADDRESS = process.env.ADDR;

let STATE = {
  _wallet: null,
  _contract: null,
  _contractAddress: ADDRESS,
  _provider: URL
}

app.get('/', async (_, res) => {
  return res.send("success");
});

app.post('/setupFlashLoan', async (req, res) => {
  console.log('Request: setupFlashLoan');

  try {
    const CONFIG = req.body;

    if (!CONFIG) throw new Error('Invalid configuration: ', CONFIG);

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    await Wallet(CONFIG, STATE._provider).then(async (wallet) => {
      // Store wallet in global state
      STATE._wallet = wallet;
      console.log('Wallet created at address: ', wallet.address);

      const web3 = wallet._web3;

      await FlashApp(STATE._provider, STATE._contractAddress).then(async (flashApp) => {
        // Store contract in global state
        STATE._contract = flashApp;

        console.log('FlashApp contract instance created at address: ', flashApp.options.address);

        const owing = web3.utils.toWei(wallet.flash_config.fee.toString());
        const tx = {
          to: flashApp.options.address,
          from: wallet.address,
          value: owing,
          data: flashApp.methods.deposit(owing).encodeABI(),
          gas: 5000000
        }

        console.log('Sending over transaction to client for it to be signed: ', tx);

        return res.send({
          message: 'success',
          payload: tx
        });
      });
    });
  } catch (err) {
    console.log('An error occurred while trying to setup the Flash Loan. Please check the console!');
    console.log(err);

    return res.send(err);
  }

});


app.listen(port);

console.log('FlashApp API (flashappi), initiated on port: ' + port);
