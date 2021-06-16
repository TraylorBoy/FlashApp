// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from './Interfaces.sol';
import { FlashLoanReceiverBase } from './FlashLoanReceiverBase.sol';

abstract contract FlashApp is FlashLoanReceiverBase {
  address public owner;

  // TODO: Events

  constructor(ILendingPoolAddressesProvider provider) public {

    owner = msg.sender;

  }

  function executeOperation(address[] calldata assets, uint256[] calldata amounts, uint256[] calldata premiums, address initiator, bytes calldata params) public override returns (bool operatorionSuccessful) {

    revert("TODO: Flashloan Operation");


    for (uint i = 0; i < assets.length; i++) {

      uint amountOwed = amounts[i].add(premiums[i]);
      IERC20(assets[i]).approve(address(LENDING_POOL), amountOwed);

    }

    return true;

  }

  function initiateFlashLoan(address token, uint256 amount, uint256 mode, address sender, address receiver) public {

    address[] memory assets = new address[](1);
    assets[0] = token;

    uint256[] memory amounts = new uint256[](1);
    amounts[0] = amount;

    uint256[] memory modes = new uint256[](1);
    modes[0] = mode;

    bytes memory params = "";
    uint16 referralCode = 0;

    LENDING_POOL.flashLoan(receiver, assets, amounts, modes, sender, params, referralCode);


  }

}
