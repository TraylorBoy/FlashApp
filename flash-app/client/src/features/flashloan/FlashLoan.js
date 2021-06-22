import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setupLoan } from "./FlashLoanSlice";
import { Box } from "rimble-ui";
import CustomButton from "../../components/CustomButton";

function FlashLoan() {
  const dispatch = useDispatch();
  const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Kovan Eth

  let wallet = useSelector(state => state.user.wallet);
  let depositAmount = useSelector(state => state.deposit.owing);
  let loanAmount = useSelector(state => state.deposit.forAmount);

  let [lock, setLock] = useState(0);
  let [locked, lockStatus] = useState(lock ? false : true);
  // 86 = Wait 91 = Pending 99 = Start 103 = Success 104 = Error
  let [flag, setFlag] = useState(86);

  useEffect(() => {
    // Unlock button
    if (loanAmount >= 0.01 && flag === 86) setLock(1);
    // Update lock
    if (locked !== lock) lockStatus(lock ? false : true);

    // Manage flag state
    return function cleanup() {
      // TODO - Reset global state, and component local state
      // TODO - Setup alert & logging
      // FlashLoan unsuccessful :(
      if (flag === 104) setFlag(86); // Unlock state

      // TODO - Reset global state, and component local state
      // FlashLoan success!
      if (flag === 103) setFlag(86); // Unlock state

      // TODO - Setup FlashLoan
      if (flag === 99) {

      }

      // TODO - Setup middleware
      if (flag === 91) {

      }

    }
  }, [depositAmount, flag, locked, lock, loanAmount]);

  const handleStart = () => {
    try {
      // Make sure user has enough funds to cover premium
      if (parseFloat(wallet.balance) > parseFloat(depositAmount)) {
        setLock(0); // Lock state
        setFlag(91); // Setup middleware

        const sender = wallet.address;
        const balance = wallet.balance;

        startFlashLoan({
          sender,
          balance,
          depositAmount,
          loanAmount,
          token
        });
      } else {
        // TODO - Remove alert and make component
        alert("Unfortunately, the balance in your wallet is not enough to cover the premium required to receive an Aave FlashLoan. Please add funds to your wallet and try again! ");
      }
    } catch (err) {
      // Error unlock state
      setFlag(104);

      // TODO handle

    }

  };

  const startFlashLoan = (LOAN_SETTINGS) => {
    setFlag(99) // Setup FlashLoan

    dispatch(setupLoan(LOAN_SETTINGS));

  }

  return (
    <Box>
      <CustomButton
        color="black"
        size="small"
        handler={handleStart}
        content="Start FlashLoan"
        metamask={false}
        disabled={locked}
      />
    </Box>
  );
}

export default FlashLoan;
