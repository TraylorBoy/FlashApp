import React, {useState} from "react";
import { Flex, Box, Card, Text, Heading } from "rimble-ui";
import CustomButton from "./CustomButton";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

function Panels(props) {
  let [fee, setFee] = useState(0);
  let [amount, setAmount] = useState(0);

  return (
    <Flex>
      <Box p={4} width={1/3}>
        <StepOne />
      </Box>
      <Box p={4} width={1/3}>
        <StepTwo />
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
