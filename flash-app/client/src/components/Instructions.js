import React from "react";
import { Flex, Box, Card, Text, Link } from "rimble-ui";


function Instructions() {
  return (
    <Flex>
      <Box p={4}>
        <Card>
          <Text.p textAlign="left">
          &emsp;After connecting your wallet via pressing the <b>Connect with MetaMask</b> button below, specifying the loan amount, and starting the FlashLoan; you will receive a transaction request through MetaMask which will request you to send the FlashApp contract a certain amount of KETH. This is required to pay the FlashLoan Premium fee of <b>0.09%</b> associated with obtaining an Aave FlashLoan. The fee will be deposited to the contract which will then initiate the FlashLoan operation and withdraw any remaining funds back to your MetaMask wallet after the loan is successfully paid back in it's entirety including the premium. <b>Debt = LoanAmount + Premium</b>.
          </Text.p>
          <Text.p textAlign="left">
            &emsp;Once the contract receives the required amount needed to pay the debt associated with the FlashLoan. It will request the loan from the Aave LendingPool for the amount of Kovan Ethereum tokens specified in the input box.
          </Text.p>
          <Text.p textAlign="left">
            &emsp;After the FlashLoan operation has completed, the contract will transfer the remaining funds back to your wallet. This all happens with one click of a button so you can just sit back, relax, and watch the transaction via <Link href="#">Etherscan</Link>. You will also be updated on the progress of the FlashLoan operation during the entire process so you won't miss a thing!
          </Text.p>
        </Card>
      </Box>
    </Flex>
  );
}

export default Instructions;
