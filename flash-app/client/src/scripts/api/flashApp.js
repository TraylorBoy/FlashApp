import getWeb3 from "../getWeb3";
import contract from "./contract";


class FlashApp {

  constructor({ SENDER, _, LOAN_AMOUNT, DEPOSIT_AMOUNT, TOKEN }) {
    this.abi = contract.abi;
    this.address = "0xCeC6EFFeC8189FBEfbb2B1abF33A13111fFDa4C9";

    this.sender = {
      address: SENDER,
      owing: DEPOSIT_AMOUNT,
      amount: LOAN_AMOUNT,
      token: TOKEN
    };
  }

  run = async () => {
    let web3 = await getWeb3();
    const contract = new web3.eth.Contract(this.abi, this.address);
    const funds = web3.utils.toWei(this.sender.owing.toString());
    const loanAmount = web3.utils.toWei(this.sender.amount.toString());
    const txCount = await web3.eth.getTransactionCount(this.sender.address);
    console.log('Transferring funds to contract: ', this.sender.owing);

    try {
      return new Promise((resolve, reject) => {
        /*contract.initiateFlashLoan(this.sender.token, loanAmount, {
          from: this.sender.address,
          to: this.address,
          value: funds,
          gas: 10000000
        })*/
        /*web3.eth.sendTransaction({
          nonce: txCount,
          from: this.sender.address,
          to: contract.options.address,
          value: funds,
          gas: 1000000
        })*/
        contract.methods.initiateFlashLoan(this.sender.token, loanAmount).send({
          from: this.sender.address,
          to: this.address,
          value: funds,
          gas: 10000000
        })
        .on('transactionHash',(hash) => {
          console.log(hash);
        })
        .on('confirmation', (confirmationNum, receipt) => {
          console.log(confirmationNum, receipt);
        })
        .on('receipt', (tx) => {
          console.log(tx);
          resolve(tx);
        })
        .on('error', (err) => {reject(err)});
      });
    } catch (err)
    {
      console.log('Error!');
      console.log(err);
    }
  }

  flashloan = async () => {
    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(this.abi, this.address);
    console.log('Starting FlashLoan');

  }
}

export default FlashApp;
