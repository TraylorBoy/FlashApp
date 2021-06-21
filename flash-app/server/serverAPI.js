// TODO: Response errors
require('dotenv').config();
const Wallet = require('./core/wallet.js');
const FlashApp = require('./core/contract.js');
const Web3 = require('web3');
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web3 provider (i.e. INFURA) & Contract address
const PROVIDER = process.env.URL;
const CONTRACT_ADDRESS = process.env.ADDR;

app.get('/', async (_, res) => {
  console.log('GET Request: /');
  return res.send("success");
});

app.post('/setupFlashLoan', async (req, res) => {
  console.log('POST Request: setupFlashLoan');

  try {
    const CONFIG = req.body;

    if (!CONFIG) throw new Error('Invalid configuration: ', CONFIG);

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    await Wallet(CONFIG, PROVIDER).then(async (wallet) => {
      console.log('Wallet created at address: ', wallet.address);

      const web3 = wallet._web3;

      await FlashApp(PROVIDER, CONTRACT_ADDRESS).then(async (flashApp) => {
        console.log('FlashApp contract instance created at address: ', flashApp.options.address);

        const owing = web3.utils.toWei(wallet.flash_config.fee.toString());
        const txCount = await web3.eth.getTransactionCount(wallet.address);

        const tx = {
          nonce: txCount,
          to: flashApp.options.address,
          from: wallet.address,
          value: owing,
          data: flashApp.methods.deposit(owing).encodeABI(),
          gas: 6000000
        };

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

app.post('/startLoan', async (req, res) => {
  console.log('POST Request: startLoan');

  try {
    if (!req.body) throw new Error('Please send over a signed transaction.');
    const signedTx = req.body;
    const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));

    await web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(async (receipt) => {
      console.log('Transaction completed, receipt: ', receipt);

      return res.send({
        message: 'success',
        payload: receipt
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
