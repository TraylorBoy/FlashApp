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

      console.log('Depositing required premium to contract, amount: ', wallet.flash_config.fee);

      const web3 = wallet._web3;
      const owing = web3.utils.toWei(wallet.flash_config.fee.toString());
      const initialBalance = web3.utils.toWei(wallet.funds.toString());

      await flashApp.methods.deposit(owing).send({
        from: wallet.address,
        value: owing
      })
      .on('transactionHash', (hash) => {
        console.log('Transaction sent, hash: ', hash);
      })
      .on('transactionConfirmed', (confirmationNumber, receipt) => {
        console.log('Transaction confirmed!');
        console.log('Confirmation #: ', confirmationNumber);
        console.log('Receipt: ', receipt);
      })
      .on('receipt', (receipt) => {
        console.log('Transaction complete, sending receipt to client');
        console.log('Receipt: ', receipt);

        return res.send({
          message: 'success',
          payload: receipt
        });
      })
      .on('error', (err, receipt) => {
        console.log('Transaction failed, sending error to client');
        console.log('Error: ', err);
        console.log('\nReceipt: ', receipt);
        throw new Error(
          err);
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
