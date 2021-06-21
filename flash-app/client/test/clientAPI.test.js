require('dotenv').config();
const assert = require('assert');
const client = require('../clientAPI');

const TEST_CONFIG = {
  WALLET: {address: '0x16435B303242Dbb0bB065433fD34f15aeB2A49CA', balance: 0.3},
  DEPOSIT_AMOUNT: 0.0009,
  LOAN_AMOUNT: 0.01,
  TOKEN: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

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
      // TODO - assert Deposit event on tx
      assert.equal(data.message, 'success');
      assert.equal(data.payload.from, TEST_CONFIG.WALLET.address);
    });

  });
});
