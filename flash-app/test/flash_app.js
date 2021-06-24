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

  it("should deposit fee to the contract", async () => {
    // Deposit the fee to the contract
    return await wallet.sendTransaction({
      nonce: await wallet.getTransactionCount(),
      to: flashapp.address,
      value: data.owed
    })
    .then(async (depositTX) => {
      console.log("Deposit receipt: ", depositTX, "\n Waiting for it to be mined");
      await depositTX.wait();

      const balance = await flashapp.getBalance({
        from: wallet.address
      });
      const etherBalance = parser(balance.toString(), "ether");

      console.log("Contract Balance: " + etherBalance);
      assert.equal(etherBalance >= data.owed, true, "Deposit failed");
    });
  });

  it("should perform flashloan then emit event LoanExecuted(reverse, amount, fee), pay back loan and emit event LoanCompleted(true/false)", async () => {
    console.log("Requesting contract to start the loan operation");
    const balance = await flashapp.getBalance({
      from: wallet.address
    });
    const etherBalance = parser(balance.toString(), "ether");

    console.log("Contract Balance: " + etherBalance);

    if (!(etherBalance >= data.owed)) {
      // Deposit funds
      await wallet.sendTransaction({
        nonce: await wallet.getTransactionCount(),
        to: flashapp.address,
        value: data.owed
      })
      .then(async (depositTX) => {
        console.log("Deposit receipt: ", depositTX, "\n Waiting for it to be mined");
        await depositTX.wait();
      });
    }

    await flashapp.requestLoan(
      data.token,
      data.forAmount,
      {
        nonce: await wallet.getTransactionCount(),
        from: wallet.address
      }
    );

    const endBalance = await flashapp.getBalance({
      from: wallet.address
    });
    const endEtherBalance = parser(endBalance.toString(), "ether");

    console.log("Contract Balance: " + endEtherBalance);
    assert.equal(endEtherBalance < data.owed, true, "FlashLoan failed");
  })
});
