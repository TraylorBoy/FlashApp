import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import { Heading, Flex, Box } from 'rimble-ui';

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, netId: null };

  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, accounts });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Flex>
          <Box p={3} width={1}>
            <Heading as="h1">FlashApp</Heading>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default App;
