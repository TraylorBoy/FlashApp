// TODO: Response errors
require('dotenv').config();
const Wallet = require('./core/wallet.js');
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  return res.send("success");
});

app.post('/setupFlashLoan', async (req, res) => {
  console.log('Request: setupFlashLoan');

  try {
    const CONFIG = req.body;

    if (!CONFIG) throw new Error('Invalid configuration: ', CONFIG);

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    await Wallet(CONFIG).then(wallet => {
      console.log('Wallet created at address: ', wallet.address);

      // TODO: Deposit premium to contract


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
