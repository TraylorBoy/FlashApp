import getWeb3 from "./getWeb3";

export const connect = async () => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];
    const netID = await web3.eth.net.getId();
    const balance = web3.utils.fromWei(await web3.eth.getBalance(address));

    return {netID, address, balance};
  } catch (err) {
    console.log(
      "Failed connecting to MetaMask",
    );
    console.error(err);
  }
}
