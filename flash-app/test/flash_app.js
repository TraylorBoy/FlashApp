require("dotenv").config();
const FlashApp = artifacts.require("FlashApp");
const assert = require("assert");
const { ethers } = require("ethers");

const INFURA_ITX = "0x015C7C7A7D65bbdb117C573007219107BD7486f9";
const TEST_AMOUNT = "0.0001";

contract("FlashApp", () => {

  let flashapp;
  let wallet;
  let itx; // Infura ITX Provider https://infura.io/docs/transactions
  let parser;
  let data = {
    amount: 0,
    fee: 0,
    owed: 0,
    forAmount: 0,
    token: ""
  }// Parameters for requesting flashloan

  beforeEach("should setup the flashapp contract and test wallet account instances", async () => {

    flashapp = await FlashApp.deployed();

    itx = new ethers.providers.InfuraProvider(
      "kovan", // Network
      process.env.ID // Infura Project ID
    )

    wallet = new ethers.Wallet(process.env.KEY, itx); // Create wallet for transactions to be routed through ITX -> Kovan

    parser = ethers.utils.parseUnits;

    data.amount = ethers.BigNumber.from(parser(TEST_AMOUNT, "ether"));
    data.fee = ethers.BigNumber.from(9);
    data.owed = parser((data.amount.mul(data.fee).div(10000)).toString(), "wei");
    data.forAmount = parser(data.amount.toString(), "ether");
    data.token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth
  });

  it("should check ITX balance > 0 of developer's account, if not then it transfers eth to the ITX account", async () => {
    // Check initial balance
    const startBalance = await itx.send("relay_getBalance", [wallet.address]);

    if (startBalance.balance <= 0) {
      // Send amount to ITX account
      const tx = await wallet.sendTransaction({
        to: INFURA_ITX,
        value: parser(TEST_AMOUNT, "ether")
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

  it("should")
});
