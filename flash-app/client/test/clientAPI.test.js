require('dotenv').config();
const axios = require('axios');
const client = require('../clientAPI');

const TEST_CONFIG = {
  WALLET: {address: process.env.WALLET_ADDRESS, balance: (0.3).toFixed(18)},
  DEPOSIT_AMOUNT: (0.0009).toFixed(18),
  LOAN_AMOUNT: (0.01).toFixed(18),
  TOKEN: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

test('requests server to setup flashloan via interacting with the FlashApp conract on the Kovan Ethereum test network with settings supplied by user', async () => {
  let res = await client.setupLoan(TEST_CONFIG);
  expect.assertions(res);
  return expect(res).toBe('success');
});
