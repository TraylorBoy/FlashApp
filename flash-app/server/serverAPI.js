// TODO: Response errors
require('dotenv').config();
const Wallet = require('./wallet.js');
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/setupFlashLoan', async (req, res) => {
  try {
    const CONFIG = await req.body.json();

    console.log('Received FlashLoan configuration: ', CONFIG);
    console.log('Setting up FlashLoan...');

    wallet = await Wallet(CONFIG);
    console.log('Wallet created: ', wallet);

    return res.send({
      status: 'success',
      message: '',
      data: null
    });
  } catch (err) {
    console.log('An error occurred while trying to setup the FLash Loan. Please check the console!');
    console.log(err);

    return res.send({
      status: 'error',
      message: err.message,
      data: null
    });
  }

});


app.listen(port);

console.log('FlashApp API (flashappi), initiated on port: ' + port);
