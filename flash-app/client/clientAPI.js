require('dotenv').config();
const axios = require('axios');

const port = process.env.PORT || 3000;
const url = 'http://localhost:' + port;
const headers = {
  'Content-Type': 'application/json'
}

const testRequest = async () => {
  const uri = '/';

  console.log('Sending GET request to server at: ', axios.default.baseURL + uri);

  let resp = await axios.get(url + uri, headers);
  
  if (resp) {
    console.log('Received response from server: ', resp);

    return resp;
  }
};

const setupLoan = async (config) => {
  const uri = '/setupFlashLoan';

  console.log('Sending POST request to server at: ', axios.default.baseURL + uri);
  console.log('Payload: ', config);

  let resp = await axios.post(url + uri, headers, JSON.stringify(config));
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
  testRequest,
  setupLoan
};
