import React from "react";
import { Flex, Box, Card } from "rimble-ui";
import Placeholder from "./Placeholder";

function Panels(props) {
  return (
    <Flex>
      <Box p={4} width={1/3}>
        <Card>
          <Placeholder />
        </Card>
      </Box>
      <Box p={4} width={1/3}>
        <Card>
          <Placeholder />
        </Card>
      </Box>
      <Box p={4} width={1/3}>
        <Card>
          <Placeholder />
        </Card>
      </Box>
    </Flex>
  );
}

export default Panels;
