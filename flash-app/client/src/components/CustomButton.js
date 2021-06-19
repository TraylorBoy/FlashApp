import React from "react";
import { MetaMaskButton, Button, Box } from "rimble-ui";

function CustomButton(props) {
  return(
    <Box p={3}>
      {props.metamask
        ? <MetaMaskButton
          mainColor={props.color}
          size={props.size}
          onClick={props.handler}
          >
          {props.content}
        </MetaMaskButton>

        : <Button
          mainColor={props.color}
          size={props.size}
          onClick={props.handler}
          >
          {props.content}
          </Button>
        }
    </Box>
  );
}

export default CustomButton;
