import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import { Flex, Box, Button } from 'rimble-ui';
import Navbar from './components/Navbar';

import "./App.css";

class App extends Component {

		constructor(props) {
			super(props);

			this.state = {

				web3: null,
				accounts: null,
				netId: 0

			}

		}

		componentDidMount = async () => {

			try {
				// Get network provider and web3 instance.
				const web3 = await getWeb3();
				this.setState({ web3 });

			} catch (error) {
				// Catch any errors for any of the above operations.
				console.log(
					`Failed to load web3. Check console for details.`,
				);
				console.error(error);
			}
		}

		handleConnect = async () => {

			try {

				console.log('Connecting...');

				// Get the user's accounts.
				const accounts = await this.state.web3.eth.getAccounts();

				// Get the user's network id.
				const netId = await this.state.web3.eth.net.getId();

				this.setState({ accounts, netId });

				console.log('Successfully connected');

			} catch (error) {
				// Catch any errors for any of the above operations.
				console.log(
					`Failed to load accounts, or network id. Check console for details.`,
				);
				console.error(error);
			}

		}

	render() {
		return (
			<div className="App">
				<Navbar isConnected={false} netId={this.state.netId}/>

				<Box p={3}>
					<Button onClick={this.handleConnect}>Connect Wallet</Button>
				</Box>

			</div>
		);
	}
}

export default App;
