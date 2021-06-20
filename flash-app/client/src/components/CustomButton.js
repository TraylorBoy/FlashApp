import React from "react";
import { MetaMaskButton, Button, Box, Flex } from "rimble-ui";

function CustomButton(props) {
  return(
    <div>
      {props.metamask
        ? <MetaMaskButton
          mainColor={props.color}
          size={props.size}
          onClick={props.handler}
          disabled={props.disabled}
          >
          {props.content}
        </MetaMaskButton>

        : <Button
          mainColor={props.color}
          size={props.size}
          onClick={props.handler}
          disabled={props.disabled}
          >
          {props.content}
          </Button>
        }
    </div>
  );
}

export default CustomButton;
