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
      let _fee = parseFloat(fee).toFixed(18);
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
      <Field label={"Amount of KETH to borrow"}>
        <Input
          type="number"
          onChange={handleChange}
          value={loanAmount}
          color="white"
          bg="black"
          placeholder="e.g. 0.1"
          fontSize="0.75rem"
          mr=""
          required
        />
      </Field>
      <Flex flexDirection="column">
        <Box p={4}>
          <Text.span textAlign="left">
            Fee: { fee } KETH
          </Text.span>
        </Box>
        <Box>
          {
            lock ?
            <Flex flexDirection="column">
              <Box>
                <Button
                  mainColor="black"
                  size="small"
                  onClick={() => setLock(false)}
                >
                  Change Amount
                </Button>
              </Box>
              <Box p={3}>
                <Icon name="CheckCircle" color="success" />
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
