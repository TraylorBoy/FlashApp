import React, {useState} from "react";
import { Flex, Box } from "rimble-ui";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

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
        <StepThree />
      </Box>
    </Flex>
  );
}

export default Panels;
