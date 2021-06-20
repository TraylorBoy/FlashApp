import React from "react";
import { Card, Text, Heading } from "rimble-ui";
import FlashLoan from "../features/flashloan/FlashLoan";

function StepThree() {
  return (
    <Card>
      <Text.span>Step 3</Text.span>
      <Heading as="h2">Start FlashLoan</Heading>
      <Text.p>
        After you have specified the amount of KETH you would like to receive for the loan, simply click the <b>Start FlashLoan</b> button below!
      </Text.p>
      <FlashLoan />
    </Card>
  );
}

export default StepThree;
