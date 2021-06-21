require('dotenv').config();
const axios = require('axios');

const port = process.env.PORT || 3000;
const url = 'http://localhost:' + port;
const headers = {
  'Content-Type': 'application/json'
}

const _testRequest = () => {
  const uri = '/';

  console.log('Sending GET request to server at: ', url + uri);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + uri, headers);
        resolve(res);
      } catch (err) {
        console.log('An error occurred while trying to test the server communication. Please check the console for more information.');
        console.log(err);
        reject(err);
      }
    });
};

const setupLoan = async (config) => {
  const uri = '/setupFlashLoan';

  console.log('Sending POST request to server at: ', url + uri);
  console.log('Payload: ', config);

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(url + uri, config);
      resolve(res);
    } catch (err) {
      console.log('An error occurred while trying to test the server communication. Please check the console for more information.');
      console.log(err);
      reject(err);
    }
  })
};

module.exports = {
  _testRequest,
  setupLoan
};
