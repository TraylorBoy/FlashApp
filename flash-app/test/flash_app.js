require("dotenv").config();
const FlashApp = artifacts.require("FlashApp");
const BN = require("bn.js");
const assert = require("assert");
const { ethers } = require("ethers");

const INFURA_ITX = "0x015C7C7A7D65bbdb117C573007219107BD7486f9";
const TEST_AMOUNT = "0.0001";

contract("FlashApp", () => {

  let flashapp;
  let wallet;
  let itx; // Infura ITX Provider https://infura.io/docs/transactions

  beforeEach("should setup the flashapp contract and test wallet account instances", async () => {

    flashapp = await FlashApp.deployed();

    itx = new ethers.providers.InfuraProvider(
      "kovan", // Network
      process.env.ID // Infura Project ID
    )

    wallet = new ethers.Wallet(process.env.KEY, itx); // Create wallet for transactions to be routed through ITX -> Kovan

  });

  it("should check ITX balance > 0 of developer's account, if not then it transfers eth to the ITX account", async () => {
    // Check initial balance
    const startBalance = await itx.send("relay_getBalance", [wallet.address]);

    if (startBalance.balance <= 0) {
      // Send amount to ITX account
      const tx = await wallet.sendTransaction({
        to: INFURA_ITX,
        value: ethers.utils.parseUnits(TEST_AMOUNT, "ether")
      });

      // Waiting for transaction to be mined
      await tx.wait();
    }

    // Check new balance
    const currentBalance = await itx.send("relay_getBalance", [wallet.address]);
    console.log("Current Balance: ", currentBalance.balance);

    let isFunded = currentBalance.balance >= TEST_AMOUNT;
    assert.equal(isFunded, true, "Transfer failed");
  });


  /*it("should send premium from wallet to contract, perform flashloan then emit event LoanExecuted(reverse, amount, fee), pay back loan and emit event LoanCompleted(true/false)", async () => {

    const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth

    const amnt = new BN(0.01);
    const fee = new BN(0.09);

    const owed = web3.utils.toWei((amnt.mul(fee)).toString());
    console.log(owed.toString());

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
    });
  });*/
});
