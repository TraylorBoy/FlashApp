// Navigation bar at the top of the application
// Displays title
import React from 'react';
import { Flex, Box, Heading } from 'rimble-ui';

function Navbar(props) {

  return (
    <Flex borderBottom="1px solid">

      <Box p={3} width={ 1 } >
        <Heading as="h1">FlashApp</Heading>
      </Box>

    </Flex>
  )

}

export default Navbar;
