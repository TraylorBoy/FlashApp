const FlashApp = artifacts.require("FlashApp");
const BN = require("bn.js");
const assert = require("assert");

contract("FlashApp", (accounts) => {

  let flashapp;
  let wallet;

  beforeEach("should setup the flashapp contract and test wallet account instances", async () => {

    flashapp = await FlashApp.deployed();

    wallet = accounts[0];

  });


  it("should send premium from wallet to contract, perform flashloan then emit event LoanExecuted(reverse, amount, fee), pay back loan and emit event LoanCompleted(true/false)", async () => {

    const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth

    const amnt = new BN(0.01);
    const fee = new BN(0.09);

    const owed = web3.utils.toWei((amnt.mul(fee)).toString());

    const initialBalance = await web3.eth.getBalance(wallet);

    return await flashapp.requestLoan(
      token,
      web3.utils.toWei(amnt),
      {
        from: wallet,
        value: owed
      }
    )
    .then(async () => {
      const newBalance = await web3.eth.getBalance(wallet);

      assert.equal(initialBalance >= newBalance, "Loan failed to complete.");
      done();
    })
    .catch(err => done(err));
  });
});
