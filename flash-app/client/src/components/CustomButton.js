import React from "react";
import { MetaMaskButton, Box } from "rimble-ui";

function CustomButton(props) {
  return(
    <Box p={3}>
      <MetaMaskButton
        mainColor={props.color}
        size={props.size}
        onClick={props.handler}
      >
        {props.content}
      </MetaMaskButton>
    </Box>
  );
}

export default CustomButton;
