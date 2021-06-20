import React from "react";
import { Card, Text, Heading } from "rimble-ui";
import Deposit from "../features/deposit/Deposit";

function StepTwo(_) {
  return (
    <Card>
      <Text.span>Step 2</Text.span>
      <Heading as="h2">Loan Amount</Heading>
      <Text.p>
        Enter the amount of KETH you would like to borrow in the field below. After that, press the <b>Set Amount</b> button underneath the field you entered the amount in. Finally, proceed to Step 3, the final step, in order to start the operation!
      </Text.p>
      <Deposit />
    </Card>
  );
}

export default StepTwo;
