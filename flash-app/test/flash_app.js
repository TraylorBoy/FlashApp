const FlashApp = artifacts.require("FlashApp");

contract("FlashApp", (accounts) => {

  let flashapp;
  let wallet;

  beforeEach("should setup the flashapp contract and test wallet account instances", async () => {

    flashapp = await FlashApp.deployed();

    wallet = accounts[0];

  });


  it("should deposit fee to contract, initiate a flashloan, then withdraw left over funds back to user wallet", async () => {

    const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth

    const amnt = 0.01;

    const fee = 0.09;

    const owed = web3.utils.toWei((amnt * fee).toString());

    const initialBalance = await web3.eth.getBalance(wallet);

    await web3.eth.sendTransaction({
      from: wallet,
      to: flashapp.address,
      value: owed
    })
    .then(async () => {
      await flashapp.initiateFlashLoan(token, web3.utils.toWei(amnt.toString())).then(async () => {

        await flashapp.emptyTheBank(wallet).then(async () => {
          const newBalance = await web3.eth.getBalance(wallet);

          let isDone = initialBalance >= newBalance;
          return assert.equal(isDone, true, "Flash Loan failed");

        });

      });
    })
  });

});
