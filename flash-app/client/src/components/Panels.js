import React, {useState} from "react";
import { Flex, Box, Card, Text, Heading, Input, Field } from "rimble-ui";
import User from "../features/user/User";
import CustomButton from "./CustomButton";

function Panels(props) {
  let [fee, setFee] = useState(0);
  let [amount, setAmount] = useState(0);

  return (
    <Flex>
      <Box p={4} width={1/3}>
        <Card>
          <Text.span>Step 1</Text.span>
          <Heading as="h2">Connect</Heading>
          <Text.p textAlign="left">
          &emsp;Connect with your MetaMask wallet in order to use the application and start your FlashLoan by clicking the button below.
          </Text.p>
          <User />
        </Card>
      </Box>
      <Box p={4} width={1/3}>
        <Card>
          <Text.span>Step 2</Text.span>
          <Heading as="h2">Loan Amount</Heading>
          <Text.p>
            Enter the amount of KETH you would like to borrow in the field below. Then proceed to Step 3 to start the operation!
          </Text.p>
          <Box>
            <Field label={"Amount of KETH to borrow"}>
              <Input
                type="number"
                onChange={(e) => setFee(fee = e.target.value * 0.09)}
                height="2rem"
                color="white"
                bg="black"
                placeholder="e.g. 0.1"
                required
              />
            </Field>
          </Box>
          <Box>
            <Text.span textAlign="left">Amount Owed: { fee } KETH</Text.span>
          </Box>
        </Card>
      </Box>
      <Box p={4} width={1/3}>
        <Card>
          <Text.span>Step 3</Text.span>
          <Heading as="h2">Start FlashLoan</Heading>
          <Text.p>
            After you have specified the amount of KETH you would like to receive for the loan, simply click the <b>Start FlashLoan</b> button below!
          </Text.p>
          <Box>
            <CustomButton
              color="black"
              size="small"
              startHandle={props.handleStart}
              content="Start FlashLoan"
              metamask={false}
              disabled={true}
            />
          </Box>
        </Card>
      </Box>
    </Flex>
  );
}

export default Panels;
