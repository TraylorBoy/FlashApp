import { ethers } from "ethers";

const getEthers = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
        resolve({provider, signer});
      } catch (error) {
        reject(error);
      }
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new ethers.providers.JsonRpcProvider(
        "http://127.0.0.1:8545"
      );
      const signer = provider.getSigner();
      console.log("No ethers instance injected, using Local ethers.");
      resolve({provider, signer});
    }
  });

export default getEthers;
