// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from './Interfaces.sol';
import { FlashLoanReceiverBase } from './FlashLoanReceiverBase.sol';

abstract contract FlashApp is FlashLoanReceiverBase {
  address public owner;
  mapping (address => uint256) accounts;

  // TODO: Events

  constructor(ILendingPoolAddressesProvider) public {

    // Set contract owner
    owner = msg.sender;

  }

  // Allow user to deposit funds + fee to contract for flash loan
  function deposit(uint256 amount) public payable {

    // Validate amount
    require(amount > 0 && msg.sender.balance > amount, "Amount less than 0 or wallet balance does not have amount to deposit");
    require(amount == msg.value, "Amount is not the same as value sent");

    // Update accounts with new amount deposited
    accounts[address(msg.sender)] = amount;


    // TODO: Emit event

  }

  function executeOperation(address[] calldata assets, uint256[] calldata amounts, uint256[] calldata premiums, address, bytes calldata) public override returns (bool operatorionSuccessful) {

    // TODO
    revert("TODO: Flashloan Operation");

    // Pay debt back to lending pool (amount owed + fee)
    for (uint i = 0; i < assets.length; i++) {

      uint amountOwed = amounts[i].add(premiums[i]);
      IERC20(assets[i]).approve(address(LENDING_POOL), amountOwed);

    }

    return true;

  }

  // Attempt to retrieve a flashloan for requested amount
  function initiateFlashLoan(address token, uint256 amount, uint256 mode, address sender, address receiver, uint256 fee) public {

    // Make sure user deposited amount to cover fee
    require(accounts[sender] >= amount * fee);

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
