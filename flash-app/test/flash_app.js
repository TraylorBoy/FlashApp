const FlashApp = artifacts.require("FlashApp");


contract("FlashApp", (accounts) => {

  let flashapp;
  let wallet;

  beforeEach("should setup the flashapp contract instance and test wallet account", async () => {

    flashapp = await FlashApp.deployed();

    wallet = accounts[0];

  });

  it("should retrieve the balance of the contract", async () => {

    const bal = await flashapp.balance();

    assert.equal(bal, 0);

  });

  it("should retrieve the balance of an account", async () => {

    const bal = await flashapp.balanceFor.call(wallet);

    assert.equal(bal, 0);

  });

  it("should deposit ether", async () => {

    await flashapp.deposit(web3.utils.toWei("0.0001"), {from: wallet, value: web3.utils.toWei("0.0001")}).then(async () => {

      const bal = await flashapp.balanceFor.call(wallet);

      return assert.equal(bal, web3.utils.toWei("0.0001"), "Deposit failed");

    });

  });

  it("should withdraw deposited ether from contract", async () => {

    await flashapp.deposit(web3.utils.toWei("0.0001"), { from: wallet, value: web3.utils.toWei("0.0001") }).then(async () => {

      await flashapp.withdraw(web3.utils.toWei("0.0001"), { from: wallet }).then(async () => {

        const bal = await flashapp.balanceFor.call(wallet);

        assert.equal(bal, 0);

      });

    });

  });

  it("should retrieve the current premium for flashloans", async () => {

    const fee = await flashapp.getFee();

    const current_fee = 0.09; // Current fee can be located at: https://docs.aave.com/developers/guides/flash-loans

    return assert.equal(fee.toNumber() / 100, current_fee, "Fee query failed");

  });

  /*it("should initiate a flashloan and emit 2 events: LoanInitiated and LoanCompleted", async () => {

    const fee = 0.009;

  });*/

  it("should selfdestruct contract", async () => {

    await flashapp.flashBang().then(async (tx) => {

      return assert.equal(tx.contractAddress, null, "Selfdestruct failed");

    });

  });

});
