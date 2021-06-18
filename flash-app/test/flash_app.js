const FlashApp = artifacts.require("FlashApp");


contract("FlashApp", (accounts) => {

  let flashapp;
  let wallet;

  beforeEach("should setup the flashapp contract instance and test wallet account", async () => {
    flashapp = await FlashApp.deployed();
    wallet = accounts[0];
  });

  it("should retrieve the balance of an account", async () => {

    const bal = await flashapp.balanceFor.call(wallet);
    
    assert.equal(bal, 0);

  });

  it("should deposit ether", async () => {

    await flashapp.deposit(web3.utils.toWei("0.001"), {from: wallet, value: web3.utils.toWei("0.001")}).then(async () => {

      const bal = await flashapp.balanceFor.call(wallet);

      return assert.equal(bal, web3.utils.toWei("0.001"), "Deposit failed");

    });

  });

});
