import getWeb3 from "../getWeb3";
import getEthers from "../getEthers";
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
    const web3 = await getWeb3();
    const {provider, signer} = await getEthers();
    const contract = new web3.eth.Contract(this.abi, this.address);
    const funds = web3.utils.toWei(this.sender.owing);
    const loanAmount = web3.utils.toWei(this.sender.amount.toString());
    const txCount = await web3.eth.getTransactionCount(this.sender.address);
    console.log('Transferring funds to contract: ', this.sender.owing);

    try {
      return new Promise(async (resolve, reject) => {
        const tx = await signer.sendTransaction({
          nonce: txCount,
          from: this.sender.address,
          to: contract.options.address,
          value: funds,
          gas: 1000000
        });

        console.log('Transaction signed: ', tx);
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
