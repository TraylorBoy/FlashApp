import React from "react";
import { Card, Flex, Box, Form, Field, Input, Button } from "rimble-ui";

function DataEntry(props) {
  return(
    <Flex flexDirection="row" justifyContent="center">
      <Box p={4}>
        <Form onSubmit={props.collectData}>
          <Field label={"Amount of Reserve for FlashLoan"}>
            <Input type="number" required />
          </Field>
          <Box p={4}>
            <Button mainColor="black" size="medium" disabled>Start FlashLoan</Button>
          </Box>
        </Form>
      </Box>
    </Flex>
  );
}

export default DataEntry;
