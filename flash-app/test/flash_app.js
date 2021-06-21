const FlashApp = artifacts.require("FlashApp");

contract("FlashApp", (accounts) => {

  let flashapp;
  let wallet;

  beforeEach("should setup the flashapp contract and test wallet account instances", async () => {

    flashapp = await FlashApp.deployed();

    wallet = accounts[0];

  });

  it("should retrieve the balance of an account", async () => {

    const bal = await flashapp.balanceFor.call(wallet);

    assert.equal(bal, 0);

  });

  it("should deposit ether", async () => {

    const amount = "0.00001"

    await flashapp.deposit({from: wallet, value: web3.utils.toWei(amount)}).then(async () => {

      const bal = await flashapp.balanceFor.call(wallet);

      return assert.equal(bal, web3.utils.toWei(amount), "Deposit failed");

    });

  });

  it("should withdraw deposited ether from contract", async () => {

    const amount = "0.00001";

    await flashapp.deposit({ from: wallet, value: web3.utils.toWei(amount) }).then(async () => {

      await flashapp.withdraw().then(async () => {

        const bal = await flashapp.balanceFor(wallet);

        assert.equal(bal, 0);

      });

    });

  });

  it("should deposit fee to contract, initiate a flashloan, then withdraw left over funds back to user wallet", async () => {

    const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth

    const amnt = 0.01;

    const fee = 0.09;

    const owed = web3.utils.toWei((amnt * fee).toString());

    await flashapp.deposit({from: wallet, value: owed}).then(async () => {

      const bal = await flashapp.balanceFor(wallet);

      assert.equal(bal, owed, "Deposit failed");

    }).then(async () => {

      await flashapp.initiateFlashLoan(token, web3.utils.toWei(amnt.toString())).then(async () => {

        await flashapp.withdraw().then(async () => {

          const isDone = await flashapp.balanceFor(wallet) == 0 ? true : false;

          return assert.equal(isDone, true, "Flash Loan failed - (Either during withdrawal or flashloan execution)");

        });

      });
    });

  });

});
