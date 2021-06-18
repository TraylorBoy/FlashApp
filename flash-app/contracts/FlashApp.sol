// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from './Interfaces.sol';
import { FlashLoanReceiverBase } from './FlashLoanReceiverBase.sol';

contract FlashApp is FlashLoanReceiverBase {
  address payable public owner;
  mapping (address => uint256) private accounts;

  // Lending pool address that will provide the loan should be passed on creation
  constructor(ILendingPoolAddressesProvider provider) FlashLoanReceiverBase(provider) public {

    // Set contract owner
    owner = payable(msg.sender);

  }

  event Deposit(address indexed from, uint256 amount);
  event Withdrawal(address indexed from, uint256 amount);
  event FlashBang(address indexed from);

  // Allows contract to receive ether
  receive() external payable {}

  // Selfdestruct contract and return funds to owner
  function flashBang() public {

    // Make sure the one calling this function is the owner of the contract
    require(msg.sender == owner, "Only the owner may call this");

    // Send event notifying of destruction
    emit FlashBang(msg.sender);

    // Terminate contract and send funds to owner
    selfdestruct(owner);

  }

  // Allow user to deposit funds to contract
  // Used for Flash Loan premium (fee) deposit
  function deposit(uint amount) public payable {

    // Validate amount
    require(amount > 0, "Amount less than 0");
    require(amount == msg.value, "Amount is not the same as value sent");

    // Update accounts with new amount deposited
    accounts[msg.sender] = amount;

    emit Deposit(msg.sender, amount);

  }

  // Allow user to withdraw funds from contract
  function withdraw(uint amount) public {

    // Validate amount
    require(amount > 0, "Amount must be greater than 0");
    require(accounts[msg.sender] >= amount, "Balance less than amount you are trying to withdraw");

    // Transfer amount to user
    require(payable(msg.sender).send(accounts[msg.sender]), "Failed to withdraw amount");

    // Update accounts
    accounts[msg.sender] -= amount;

    emit Withdrawal(msg.sender, amount);

  }

  // Query the current balance of the contract
  function balance() public view returns (uint) {
    return address(this).balance;
  }

  // Query the current balance of an account
  function balanceFor(address account) public returns (uint) {
    return accounts[account];
  }

  // Once flash loan is received, this method is excuted
  // After flashloan operation is completed, the amount + fee is paid back to the lending pool
  function executeOperation(address[] calldata assets, uint256[] calldata amounts, uint256[] calldata premiums, address, bytes calldata) external override returns (bool operatorionSuccessful) {

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

    // TODO: Emit event


  }

}
