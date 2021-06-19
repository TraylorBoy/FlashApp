// Navigation bar at the top of the application
// Displays title
import React from 'react';
import { Flex, Box, Heading, EthAddress } from 'rimble-ui';

function Navbar(props) {

  return (
    <div>
      <Box p={3}>
        <Heading as="h1">{props.header}</Heading>
      </Box>

      <Flex borderBottom="1px solid">
      <Box p={3} width={1/2}>
        <p>Reserve Token: <b>{props.token}</b></p>
      </Box>
        <Box p={3} width={1/2}>
          <p>Deposit Premium: <b>{props.premium}%</b></p>
        </Box>
      </Flex>
    </div>
  )

}

export default Navbar;
