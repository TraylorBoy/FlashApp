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
  _config: null,
  _wallet: null,
  _contract: {
    address: process.env.CONTRACT_ADDR,
    instance: null
  }
}

app.get('/', async (_, res) => {
  return res.send("success");
});

app.post('/setupFlashLoan', async (req, res) => {
  console.log('Request: setupFlashLoan');

  try {
    const CONFIG = req.body;
    const CONTRACT_ADDR = STATE._contract.address;

    if (!CONFIG) throw new Error('Invalid configuration: ', CONFIG);

    // Store config global state
    STATE._config = CONFIG;

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    await Wallet(CONFIG).then(wallet => {
      // Update state with initialized web3 wallet
      STATE._wallet = wallet;
      console.log('Wallet created at address: ', wallet.address);

      const flashApp = await FlashApp(wallet._provider, CONTRACT_ADDR);

      console.log('FlashApp contract instance created at address: ', CONTRACT_ADDR);

      console.log(flashApp);

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
