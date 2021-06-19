// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

// TASKS:
// ☐ Document w/ natspec
// ☐ Optimize & remove unnecessary code (ref. Style Guide)
// ☐ Organize code sections w/ comment headers/dividers

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from './Interfaces.sol';
import { FlashLoanReceiverBase } from './FlashLoanReceiverBase.sol';

contract FlashApp is FlashLoanReceiverBase {
  mapping (address => uint256) private accounts;

  // Lending pool address that will provide the loan should be passed on creation
  constructor(address _addressProvider) FlashLoanReceiverBase(_addressProvider) public {}

  event Deposit(address indexed from, uint256 amount);
  event Withdrawal(address indexed from, uint256 amount);
  event LoanInitiated(address indexed from, address reserve, uint256 amount, uint256 fee);
  event LoanExecuted(address reserve, uint256 amount, uint256 fee);
  event LoanCompleted(address indexed user, uint256 balance, address reserve, uint256 amount, uint256 fee);

  // Allow user to deposit funds to contract
  // Wraps deposited funds into WETH
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
  function withdraw() public {

    // Transfer amount to user
    require(payable(msg.sender).send(accounts[msg.sender]), "Failed to withdraw amount");

    emit Withdrawal(msg.sender, accounts[msg.sender]);

    // Update accounts
    delete accounts[msg.sender];

  }

  // Query the current balance of an account
  function balanceFor(address account) public view returns (uint) {
    return accounts[account];
  }

  // Update user account balance after loan is paid back
  function updateAccount(address account, uint fee) private returns (bool) {

    if (accounts[account] - fee >= 0) {
      // Subtract the fee from user account
      accounts[account] -= fee;

      return true;
    }

    return false;

  }

  // Once flash loan is received, this method is excuted
  // After flashloan operation is completed, the amount + fee is paid back to the lending pool
  // The method currently does nothing with the received loan(s), but emit events on successful
  // loan completion for each of the assets loaned out
  // Loan completion happens when the debt + premium fee is paid back to the lending pool
  function executeOperation(address _reserve, uint256 _amount, uint256 _fee, bytes calldata _params) external override {

    // Make sure loan was successful
    require(_amount <= getBalanceInternal(address(this), _reserve), "Invalid balance, was the flashLoan successful?");

    emit LoanExecuted(_reserve, _amount, _fee);

    // Pay debt back to lending pool (amount owed + fee)
    uint totalDebt = _amount + _fee;
    transferFundsBackToPoolInternal(_reserve, totalDebt);

    ( address account ) = abi.decode(_params, (address));

    // Update new user balance
    updateAccount(account, _fee);

    // Emit successful flashloan
    emit LoanCompleted(account, accounts[account], _reserve, _amount, _fee);

  }

  // Attempt to retrieve a flashloan for requested amount
  // For this project, there will only be 1 asset selected for each loan operation
  function initiateFlashLoan(address token, uint256 amount) public {

    // Validate input
    require(accounts[msg.sender] > 0, "Please deposit the fee for the loan first");

    bytes memory params = abi.encode(msg.sender);

    // Initiate the flashloan with supplied params from client
    ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());
    lendingPool.flashLoan(address(this), token, amount, params);

    emit LoanInitiated(msg.sender, token, amount, accounts[msg.sender]);

  }

}
