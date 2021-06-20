// SPDX-License-Identifier: MIT


pragma solidity ^0.6.6;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";

/// @title A contract for Aave FlashLoan interaction
/// @author Marques Traylor
/// @notice Contract is using Aave v1
/// @dev User deposits fee, contract performs flash loan, left over balance automatically withdrawn from contract and sent back to user
contract FlashApp is FlashLoanReceiverBase {
	mapping(address => uint256) private accounts;

	/// @notice Aave V1 contract addresses may be found here - https://docs.aave.com/developers/v/1.0/deployed-contracts/deployed-contract-instances
	/// @dev Pass the address as a parameter to deployer in migrations along with the contract
	/// @param _addressProvider Aave V1 LendingPoolAddressProvider
	constructor(address _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {
    }

	/// Emits when a user deposits the premium associated with the FlashLoan
	/// @notice Will not emit if deposit fails (i.e. user balance < amount or msg.value != amount)
	/// @param from User address that is depositing the premium
	/// @param amount Amount that user is depositing
	event Deposit(address indexed from, uint256 amount);

	/// Emits when user or contract withdraws deposited funds from contract
	/// @notice Will not emit if withdraw fails (i.e. accounts[msg.sender] == 0)
	/// @param from User address that is withdrawing deposited funds
	/// @param amount Amount currently owned by user in contract (can be less if they initiated a flash loan)
	event Withdrawal(address indexed from, uint256 amount);

	/// Emits when initiateFlashLoan is called and flashLoan has been successfully called on lendingPool
	/// @notice Will not emit if required fee is not deposited first
	/// @param from User address that initiated the flash loan
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	/// @param fee Premium associated with the loan
	event LoanInitiated(
        address indexed from,
        address reserve,
        uint256 amount,
        uint256 fee
    );

	/// Emits when lendingPool calls our executeOperation override and the loan was successfully received
	/// @notice Will not emit if loan was not received
	/// @param from User address that initiated the flash loan
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	/// @param fee Premium associated with the loan
	event LoanExecuted(
        address indexed from,
        address reserve,
        uint256 amount,
        uint256 fee
    );

	/// Emits after loan has been received and operation has been completed, the debt has been paid back, and user's account balance has been updated
	/// @notice Will not emit if the operation process fails
	/// @param from User address that initiated the flash loan
	/// @param balance Updated user balance in contract after debt is paid back
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	/// @param fee Premium associated with the loan
	event LoanCompleted(
        address indexed from,
        uint256 balance,
        address reserve,
        uint256 amount,
        uint256 fee
    );

    /**
	Once flash loan is received, this method is excuted and after flashloan operation is completed, the amount + fee is paid back to the lending pool.
	The method currently does nothing with the received loan(s), but emit events on successful loan execution and completion for the reserve being loaned out.
	Loan execution happens when the contract successfully recevies the loan.
	Loan completion happens when the debt + premium fee is paid back to the lending pool.
	*/
	/// @notice See Aave V1 documentation at - https://docs.aave.com/developers/v/1.0/tutorials/performing-a-flash-loan
	function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    )
        external
        override
    {
		require(
            _amount <= getBalanceInternal(address(this), _reserve),
            "Invalid balance, was the flashLoan successful?"
        );

		// Retrieve user address
		(address account) = abi.decode(_params, (address));

		// Loan received
		emit LoanExecuted(account, _reserve, _amount, _fee);

		// Pay debt back to lending pool (amount owed + fee)
		uint totalDebt = _amount + _fee;
		transferFundsBackToPoolInternal(_reserve, totalDebt);

		// Update new user balance
		updateAccount(account, _fee);

		// Loan paid back
		emit LoanCompleted(
            account,
            accounts[account],
            _reserve, _amount,
            _fee
        );
	}

    /// Attempt to retrieve a flashloan for requested amount
	/// @notice Uses Aave V1 which only requires 1 asset address to be passed
	/// @dev Caller must deposit premium before requesting a FlashLoan
	/// @param token Token address for the asset User wants to loan
	/// @param amount Amount of tplem to request for the loan
	function initiateFlashLoan(address token, uint256 amount) public {
		require(accounts[msg.sender] > 0, "Please deposit the fee for the loan first");

		// Address will be used to update account balance after debt is paid back
		// during the loan operation
		bytes memory params = abi.encode(msg.sender);

		// Uses Aave V1 addressProvider
		ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());

		// Request loan for amount of token
		lendingPool.flashLoan(address(this), token, amount, params);

		// Loan request sent
		emit LoanInitiated(msg.sender, token, amount, accounts[msg.sender]);
	}

	/// @notice Used for Flash Loan premium (fee) deposit
	/// @dev Must deposit first before calling initiateFlashLoan
	/// @param amount Amount that user is depositing
	function deposit(uint amount) public payable {
		require(amount > 0, "Amount less than 0");
		require(amount == msg.value, "Amount is not the same as value sent");

		// Update accounts with new amount deposited
		accounts[msg.sender] = amount;

		emit Deposit(msg.sender, amount);
	}

	/// @notice User funds will be less after FlashLoan is completed
	/// @dev User balance on contract (accounts[msg.sender]) is updated during the loan operation
	function withdraw() public {
		require(
            payable(msg.sender).send(accounts[msg.sender]),
            "Failed to withdraw amount"
        );

        // Sent back funds
		emit Withdrawal(msg.sender, accounts[msg.sender]);

		// Remove account
		delete accounts[msg.sender];
	}

	/// Query the current balance of an account
	/// @notice Will return 0 if account has not deposited yet
	/// @param account User account balance being queried
	/// @return uint Current balance account has on contract
	function balanceFor(address account) public view returns (uint) {
		return accounts[account];
	}

	/// Updates user account balance after loan is paid back
	/// @notice Will deduct premium paid for the FlashLoan
	/// @notice Balance left over must be over 0, else account will not be updated
	/// @dev Contract updates account after debt is paid back and emits LoanCompleted containing the new balance
	/// @dev If account is not updated then user deposited exact premium amount
	/// @param account User address that initiated the FlashLoan
	/// @param fee Premium paid for the FlashLoan
	function updateAccount(address account, uint fee) private {
		if (accounts[account] - fee >= 0) {
			accounts[account] -= fee;
		}
	}
}
