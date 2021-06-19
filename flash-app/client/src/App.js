import React, { Component } from "react";
import { Flex, Box, Card } from "rimble-ui";
import Navbar from "./components/Navbar";
import Placeholder from "./components/Placeholder";
import CustomButton from "./components/CustomButton";
import Panels from "./components/Panels";
import DataEntry from "./components/DataEntry";
import getWeb3 from "./scripts/getWeb3";
import "./styles/App.css";

// Tasks:
// - Replace logo.svg with actual logo (generate a .svg from .png)
// - Configure store
// - Fix responsiveness for mobile (try wrapping in flex)
// - Develop and integerate FlashApp API w/ redux-saga
// - Write and complete w/ all passing - React, Redux, & Redux-Saga Tests
// - UI/UX Test
// - Front-end Contract Interaction Test
// - Go over dapp design guidelines
// - Correct syntax via style guide
// - Document w/ docstrings
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

				console.log("Connecting...");

				// Get the user"s accounts.
				const accounts = await this.state.web3.eth.getAccounts();

				// Get the user"s network id.
				const netId = await this.state.web3.eth.net.getId();

				this.setState({ accounts, netId });

				console.log("Successfully connected");

			} catch (error) {
				// Catch any errors for any of the above operations.
				console.log(
					`Failed to load accounts, or network id. Check console for details.`,
				);
				console.error(error);
			}

		}

		handleData = async (e) => {
			alert("This does nothing yet");
			e.preventDefault();
		}

	render() {
		return (
			<div className="App">
				<Card>

					<Navbar
						header="FlashApp"
						premium="0.09"
						token="Kovan Test-Net Ethereum (KETH)"
						tokenAddress="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
					 />

					<Panels />

					<DataEntry collectData={this.handleData} />

					<CustomButton
						color="black"
						size="medium"
						handler={this.handleConnect}
						content="Connect with MetaMask"
						metamask={true}
					/>

				</Card>
			</div>
		);
	}
}

export default App;
