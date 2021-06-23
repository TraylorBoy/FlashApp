// SPDX-License-Identifier: MIT


pragma solidity ^0.6.6;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";

/// @title A contract that receives an Aave FlashLoan, emits an event, then 	pays back the loan
/// @author Marques Traylor
/// @notice Contract is using Aave v1
contract FlashApp is FlashLoanReceiverBase {
	/// @notice Aave V1 contract addresses may be found here - https://docs.aave.com/developers/v/1.0/deployed-contracts/deployed-contract-instances
	/// @dev Pass the address as a parameter to deployer in migrations along with the contract
	/// @param _addressProvider Aave V1 LendingPoolAddressProvider
	constructor(address _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {
    }

	/// Emits when lendingPool calls our executeOperation override and the loan was successfully received
	/// @notice Will not emit if loan was not received
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	/// @param fee Premium associated with the loan
	event LoanExecuted(
        address reserve,
        uint256 amount,
        uint256 fee
    );

	/// Emits after loan has been received and operation has been completed, and the debt has been paid back
	/// @notice Will not emit if the operation process fails
	/// @param successful Debt paid back and loan completed successfully
	event LoanCompleted(bool successful);

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
        bytes calldata
    )
        external
        override
    {
		require(
            _amount <= getBalanceInternal(msg.sender, _reserve),
            "Invalid balance, was the loan successful?"
        );

		// Loan received successfully
		emit LoanExecuted(_reserve, _amount, _fee);

		// Pay debt back to lending pool (amount owed + fee)
		uint totalDebt = _amount.add(_fee);
		transferFundsBackToPoolInternal(_reserve, totalDebt);

		// Loan paid back successfully
		emit LoanCompleted(true);
	}

  /// Attempt to retrieve a flashloan for requested amount
	/// @notice Uses Aave V1 which only requires 1 asset address to be passed
	/// @dev Caller must deposit premium before requesting a FlashLoan, they may send it along with this method call
	/// @param token Token address for the asset User wants to loan
	/// @param amount Amount of tplem to request for the loan
	function requestLoan(address token, uint256 amount) public onlyOwner {
		// Pass data to `executeOperation`
		bytes memory params = "";

		// Uses Aave V1 addressProvider
		ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());

		// Request loan for amount of token
		lendingPool.flashLoan(address(this), token, amount, params);
	}

	/// Returns the current contract balance to the caller
	/// @dev Used for checking if the user successfully sent over the premium
	function getBalance() public view returns (uint) {
		return address(this).balance;
	}
}
