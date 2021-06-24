// SPDX-License-Identifier: MIT


pragma solidity 0.6.12;

import { IWETHGateway } from "./Interfaces.sol";

/// @title Native ETH to WETH Converter
/// @dev Uses Kovan WETH as default
/// @author Marques Traylor
contract WETHConverter {
  /// @dev wethGateway Contract to convert callers native eth to weth
  IWETHGateway wethGateway;

  /// @dev All addresses are from the Kovan Public TestNet
  address constant wETHGatewayProvider = address(0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70);
  address immutable poolProvider = address(0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe);
  address immutable WETH = address(0xd0A1E359811322d97991E03f863a0C30C2cF029C);

  /// Address to the WETHGateway Contract
  /// @dev The FlashApp contract is deployed on the kovan network
  constructor()
    public
  {
    wethGateway = IWETHGateway(wETHGatewayProvider);
  }

  /// Allows contract to receive ether payments
  receive() payable external {}

  function convert(uint amount) public payable {
    require(
      amount == msg.value,
      "Amount converting is different than amount sent"
    );

    address payable onBehalfOf = payable(msg.sender);

    // Deposit the native eth to the pool
    wethGateway.depositETH{
      value: msg.value
    }(
      poolProvider,
      onBehalfOf,
      uint16(0)
    );
  }
}
