// TODO: Response errors
require('dotenv').config();
const Wallet = require('./core/wallet.js');
const FlashApp = require('./core/contract.js');
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let STATE = {
  _wallet: null,
  _contract: null,
  _contractAddress: process.env.CONTRACT_ADDR
}

app.get('/', async (_, res) => {
  return res.send("success");
});

app.post('/setupFlashLoan', async (req, res) => {
  console.log('Request: setupFlashLoan');

  try {
    const CONFIG = req.body;
    const CONTRACT_ADDR = STATE._contractAddress;

    if (!CONFIG) throw new Error('Invalid configuration: ', CONFIG);

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    await Wallet(CONFIG).then(async (wallet) => {
      // Store wallet in global state
      STATE._wallet = wallet;
      console.log('Wallet created at address: ', wallet.address);

      const flashApp = await FlashApp(wallet._provider, CONTRACT_ADDR);

      // Store contract in global state
      STATE._contract = flashApp;

      console.log('FlashApp contract instance created at address: ', flashApp.options.address);

      const web3 = wallet._web3;

      console.log('Depositing required premium to contract, amount: ', wallet.flash_config.fee);

      // TODO: Deposit funds to contract

      // TODO: Send Deposit TX with success message
      return res.send('success');
    });
  } catch (err) {
    console.log('An error occurred while trying to setup the Flash Loan. Please check the console!');
    console.log(err);

    return res.send(err);
  }

});


app.listen(port);

console.log('FlashApp API (flashappi), initiated on port: ' + port);
