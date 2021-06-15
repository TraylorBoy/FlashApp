import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import { Flex } from 'rimble-ui';
import Navbar from './components/Navbar';

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null };

    constructor(props) {
      super(props);

      this.state = {

        web3: null,
        accounts: null,
        netId: 0

      }

    }

    /*try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, accounts });

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }*/


  render() {
    return (
      <div className="App">
        <Navbar isConnected={false} netId={this.state.netId}/>
      </div>
    );
  }
}

export default App;
