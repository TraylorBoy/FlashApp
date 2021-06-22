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

  deposit = async () => {
    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(this.abi, this.address);
    const funds = web3.utils.toWei(this.sender.owing.toString());
    console.log('Transferring funds to contract: ', this.sender.owing);

    try {
      return new Promise((resolve, reject) => {
        contract.methods.deposit(funds).send({
          from: this.sender.address,
          value: funds,
          gas: 6000000
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
}

export default FlashApp;
