import React from "react";
import { Heading, Text, Card } from "rimble-ui";
import User from "../features/user/User";

function StepOne(_) {
  return (
    <Card>
      <Text.span>Step 1</Text.span>
      <Heading as="h2">Connect</Heading>
      <Text.p textAlign="left">
      &emsp;Connect with your MetaMask wallet in order to use the application and start your FlashLoan by clicking the button below.
      </Text.p>
      <User />
    </Card>
  );
}

export default StepOne;
