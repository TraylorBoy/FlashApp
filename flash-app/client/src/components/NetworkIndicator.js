import React from "react";
import { useSelector } from "react-redux";
import { Flex, Text, Icon, Tooltip, Box } from 'rimble-ui';

function NetworkIndicator() {

  let network = useSelector(state => state.user.connection.network);
  let correctNetwork = network === "KOVAN";

  let localProps = {
    icon: correctNetwork ? "CheckCircle" : "Error",
    color: correctNetwork ? "success" : "danger",
    message: correctNetwork ? "You're on the right network" : "You're on the wrong network – switch to Kovan network (You may have to refresh your web browser after you do!)"
  }

  return (
    <div>
      <Box display="inline-block">
        <Flex flexDirection="column">
          <Text fontSize={1} color="silver" caps>
            Current Network
          </Text>
          <Tooltip message={localProps.message}>
            <Flex>
              <Text mr={2}>{network}</Text>
              <Icon name={localProps.icon} color={localProps.color} />
            </Flex>
          </Tooltip>
        </Flex>
      </Box>
      <Box display="inline-block">
        <Text fontSize={1} color={localProps.color} caps>
          {localProps.message}
        </Text>
      </Box>
    </div>
  );
}

export default NetworkIndicator;
