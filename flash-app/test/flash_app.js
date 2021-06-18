const FlashApp = artifacts.require("FlashApp");


contract("FlashApp", (accounts) => {

  it("should deposit ether", async () => {

    const flashapp = await FlashApp.deployed();
    const account = accounts[0];

    await flashapp.deposit(web3.utils.toWei("0.001"), {from: account, value: web3.utils.toWei("0.001")}).then(async () => {
      return assert.equal(await flashapp.balance(), web3.utils.toWei("0.001"), "Deposit failed");
    });

  });

});
