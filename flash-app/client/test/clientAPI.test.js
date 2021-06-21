require('dotenv').config();
const assert = require('assert');
const client = require('../clientAPI');

const TEST_CONFIG = {
  WALLET: {address: '0x16435B303242Dbb0bB065433fD34f15aeB2A49CA', balance: (0.3).toFixed(18)},
  DEPOSIT_AMOUNT: (0.0009).toFixed(18),
  LOAN_AMOUNT: (0.01).toFixed(18),
  TOKEN: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

describe('testRequest', () => {
  it('should send a GET request to `localhost:3000/` and receive a success message', async () => {
    await client._testRequest().then(({data}) => {
      assert.equal(data, 'success');
    });
  });
});
