require('dotenv').config();
const client = require('../clientAPI');

const TEST_CONFIG = {
  WALLET: {address: '0x16435B303242Dbb0bB065433fD34f15aeB2A49CA', balance: (0.3).toFixed(18)},
  DEPOSIT_AMOUNT: (0.0009).toFixed(18),
  LOAN_AMOUNT: (0.01).toFixed(18),
  TOKEN: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

test('sends a get request to test server communication', async () => {
  let res = await client.testRequest();
  expect.assertions(res);

  const data = res.data;

  return expect(data.message).toBe('success');
});

/*test('requests server to setup flashloan via interacting with the FlashApp conract on the Kovan Ethereum test network with settings supplied by user', async () => {
  let res = await client.setupLoan(TEST_CONFIG);

  return expect(res).toBe('success');
});*/
