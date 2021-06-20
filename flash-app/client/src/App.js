import React, { Component } from "react";
import { Card, Flex, Box } from "rimble-ui";
import Navbar from "./components/Navbar";
import Instructions from "./components/Instructions";
import Panels from "./components/Panels";
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
		}

		handleStart = async (e) => {
			alert("This does nothing yet");
			e.preventDefault();
		}

	render() {
		return (
			<div className="App">
				<Flex>
					<Box>
						<Card>

							<Navbar
								header="FlashApp"
								premium="0.09"
								token="Kovan Ethereum (KETH)"
								tokenAddress="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
							 />

							<Instructions />

							<Panels
								connectHandle={this.handleConnect}
								startHandle={this.handleStart}
							/>

						</Card>
					</Box>
				</Flex>
			</div>
		);
	}
}

export default App;
