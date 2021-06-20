import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAmount } from "./DepositSlice";
import { Flex, Box, Text, Input, Field, Icon, Button } from "rimble-ui";

function Deposit() {
  const dispatch = useDispatch();

  let user = useSelector(state => state.user);
  let premium = useSelector(state => state.deposit.premium);

  let [loanAmount, setLoanAmount] = useState(0);
  let [fee, setFee] = useState(0);
  let [lock, setLock] = useState(false);

  const handleChange = (e) => {
    let amnt = e.target.value;

    setLoanAmount(amnt);
    setFee((amnt * premium).toFixed(5));
  }

  const handleSubmit = () => {
    if (user.connection.success && loanAmount >= 0.01) {
      // Format
      let _fee = parseFloat(loanAmount).toFixed(18);
      let _loanAmount = parseFloat(loanAmount).toFixed(18);

      dispatch(setAmount({_fee, _loanAmount}));
      setLock(true);

    } else {
      // TODO - Remove alert and make component
      alert("Please enter a Loan Amount greater than or equal to 0.01");
    }
  }

  return (
    <div>
      <Flex flexDirection="column">
        <Box p={4}>
          <Text.span textAlign="left">
            Fee: { fee } KETH
          </Text.span>
        </Box>
        <Box>
          <Field label={"Amount of KETH to borrow"}>
            <Input
              type="number"
              onChange={handleChange}
              value={loanAmount}
              height="2rem"
              color="white"
              bg="black"
              placeholder="e.g. 0.1"
              required
            />
          </Field>
        </Box>
        <Box>
          {
            lock ?
            <Flex>
              <Box width={1/2}>
                <Text mr={2}>Loan Amount set!</Text>
                <Icon name="CheckCircle" color="success" />
              </Box>
              <Box width={1/2}>
                <Button
                  mainColor="black"
                  size="small"
                  onClick={() => setLock(false)}
                >
                  Change Amount
                </Button>
              </Box>
            </Flex>
            :
            <Button
              mainColor="black"
              size="small"
              onClick={handleSubmit}
              disabled={!user.connection.success}
            >
              Set Amount
            </Button>
          }
        </Box>
      </Flex>
    </div>
  );
}

export default Deposit;
