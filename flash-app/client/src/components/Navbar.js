// Navigation bar at the top of the application
// Displays title
import React from 'react';
import { Flex, Box, Heading, Text } from 'rimble-ui';

function Navbar(props) {

  return (
    <div>
      <Box p={3}>
        <Heading as="h1">{props.header}</Heading>
      </Box>

      <Flex borderBottom="1px solid">
      <Box p={3} width={1/2}>
        <Text.span>Reserve Token: <b>{props.token}</b></Text.span>
      </Box>
        <Box p={3} width={1/2}>
          <Text.span>Deposit Premium: <b>{props.premium}%</b></Text.span>
        </Box>
      </Flex>
    </div>
  )

}

export default Navbar;
