require('dotenv').config();
const axios = require('axios');

const url = process.env.URL || 'localhost:'
const port = process.env.PORT || 3000;

axios.default.baseURL = url + port;

const setupLoan = async (config) => {
  const uri = '/setupFlashLoan';

  console.log('Sending request to server at: ', axios.default.baseURL + uri);
  console.log('Payload: ', config);

  let resp = await axios.post(uri, config);
  console.log('Received response from server: ', resp);

  if (resp.status === 'success') {
    return resp;
  } else if (resp.status === 'error') {
    throw new Error(resp.message);
  } else {
    // do nothing
  }
};

module.exports = {
  setupLoan
};
