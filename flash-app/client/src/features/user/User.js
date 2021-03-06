import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attemptConnect, getWallet } from "./UserSlice";
import { Flex, Box } from "rimble-ui";
import CustomButton from "../../components/CustomButton";
import NetworkIndicator from "../../components/NetworkIndicator";

function User() {
  const dispatch = useDispatch();

  let connection = useSelector(state => state.user.connection);

  let [flag, setFlag] = useState(0);

  // Request MetaMask connection
  if (flag) {
    dispatch(attemptConnect());
  }

  useEffect(() => {
    if (connection.status === "request_pending") {
      dispatch(getWallet()); // create wallet
    }

    return function cleanup() {
      setFlag(0); // reset state
    }
  }, [connection, dispatch]);

  return (
    <Flex flexDirection="column">
      {connection.success ?
        <Box p={4}>
          <NetworkIndicator />
        </Box>
        :
        <Box>
          <CustomButton
            color="black"
            size="small"
            handler={() => setFlag(1)}
            content="Connect Wallet"
            metamask={true}
          />
        </Box>
      }
    </Flex>
  );
}

export default User;
