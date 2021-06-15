// Navigation bar at the top of the application
// Displays text if user wallet is connected or not
import React from 'react';
import { Flex, Box, Heading } from 'rimble-ui';

function Navbar(props) {

  return (
    <Flex alignItems="center" borderBottom="1px solid">

      <Box p={3} width={ 1 / 4 }>
        <p>Connected: { props.isConnected ? "Yes" : "No" }</p>
      </Box>

      <Box p={3} width={ 2 / 4 }>
        <Heading as="h1">FlashApp</Heading>
      </Box>

      <Box p={3} width={ 1 / 4 }>
        <p>Network: { props.netId === 0 ? "" : props.netId }</p>
      </Box>

    </Flex>
  )

}

export default Navbar;
