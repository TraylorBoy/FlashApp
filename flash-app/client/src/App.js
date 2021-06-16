import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import { Flex, Box, Card, Button } from 'rimble-ui';
import Navbar from './components/Navbar';

import "./App.css";

class App extends Component {

		constructor(props) {
			super(props);

			this.state = {

				web3: null,
				accounts: null,
				netId: 0,
				isConnected: false

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

				<Card>

					<Navbar />

					<Box p={3}>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices nibh nec fermentum bibendum. Nullam venenatis pellentesque nibh, vel ultrices dui consequat nec. Integer lectus massa, lacinia vitae odio at, porttitor mollis massa. Curabitur viverra eget magna vitae viverra. Cras leo tortor, sagittis ac massa non, aliquet imperdiet dui. Etiam rutrum eleifend orci ac iaculis. Fusce lacinia lobortis quam, quis semper libero cursus tincidunt. Nullam consequat, nisl vitae rutrum malesuada, lacus eros ornare lacus, nec fermentum orci nisl at mauris. Quisque in diam eu leo molestie pellentesque. Ut urna ex, mattis a dictum vitae, maximus nec purus. Integer finibus nulla odio, ut faucibus nibh ultrices et. Donec mattis odio metus, eget dictum nulla venenatis vitae. Aenean suscipit nisl diam, ac pharetra quam lobortis vitae. Aliquam id ex sit amet metus pulvinar molestie a vel erat. Suspendisse luctus turpis id sapien finibus rhoncus.</p>
					</Box>

					<Box p={3}>
						<Button mainColor="black" size="small" onClick={this.handleConnect}>Connect Wallet</Button>
					</Box>

				</Card>

			</div>
		);
	}
}

export default App;
