require('dotenv').config();
const assert = require('assert');
const client = require('../clientAPI');
const Web3 = require('web3');
const HDWallet = require('@truffle/hdwallet-provider');

// Web3 provider (i.e. INFURA) & Wallet private key
// & Wallet address
const PROVIDER = process.env.URL;
const KEY = process.env.KEY;
const ADDRESS = process.env.ADDR;

const TEST_CONFIG = {
  WALLET: {address: ADDRESS, balance: 0.3},
  DEPOSIT_AMOUNT: 0.0009,
  LOAN_AMOUNT: 0.01,
  TOKEN: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

describe('FlashApp Client API (flashappci)', () => {
  describe('testRequest', () => {
    it('should send a GET request to `localhost:<PORT>/` and receive a success message', async () => {
      return await client._testRequest().then(({data}) => {
        assert.equal(data, 'success');
      });
    });
  });

  describe('setupLoan', () => {
    it('should send the TEST_CONFIG to the server and receive a transaction', async () => {
      return await client.setupLoan(TEST_CONFIG)
      .then(({data}) => {
        assert.equal(data.message, 'success');
        assert.equal(data.payload.from, TEST_CONFIG.WALLET.address);
      });

    });
  });

  describe('startLoan', () => {
    it('should setup & sign the transaction, then start & complete the FlashLoan', async () => {
      return await client.setupLoan(TEST_CONFIG)
      .then(async ({data}) => {
        assert.equal(data.message, 'success');

        const web3 = new Web3(new HDWallet(KEY, PROVIDER));

        const wallet = web3.eth.accounts.wallet.add(KEY);
        const signedTx = await wallet.signTransaction(data.payload);
        console.log(signedTx);

        await client.startLoan(signedTx)
        .then(async ({data}) => {
          assert.equal(data.message, 'success');
        });
      });
    });
  });
});
