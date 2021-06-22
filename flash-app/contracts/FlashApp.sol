// SPDX-License-Identifier: MIT


pragma solidity ^0.6.6;

import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";

/// @title A contract for Aave FlashLoan interaction
/// @author Marques Traylor
/// @notice Contract is using Aave v1
/// @dev User deposits fee, contract performs flash loan, left over balance automatically withdrawn from contract and sent back to user
contract FlashApp is FlashLoanReceiverBase {
	/// @notice Aave V1 contract addresses may be found here - https://docs.aave.com/developers/v/1.0/deployed-contracts/deployed-contract-instances
	/// @dev Pass the address as a parameter to deployer in migrations along with the contract
	/// @param _addressProvider Aave V1 LendingPoolAddressProvider
	constructor(address _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {
    }

	/// Allows contract to receive ether
  receive() payable external virtual override {}

	/// Emits when initiateFlashLoan is called and flashLoan has been successfully called on lendingPool
	/// @notice Will not emit if required fee is not deposited first
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	event LoanInitiated(
        address reserve,
        uint256 amount
    );

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

	/// Emits after loan has been received and operation has been completed, the debt has been paid back, and user's account balance has been updated
	/// @notice Will not emit if the operation process fails
	/// @param reserve Token address for the asset User wants to loan
	/// @param amount Amount of reserve to request for the loan
	/// @param fee Premium associated with the loan
	event LoanCompleted(
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
        bytes calldata
    )
        external
        override
    {
		require(
            _amount <= getBalanceInternal(address(this), _reserve),
            "Invalid balance, was the flashLoan successful?"
        );

		// Loan received
		emit LoanExecuted(_reserve, _amount, _fee);

		// Pay debt back to lending pool (amount owed + fee)
		uint totalDebt = _amount + _fee;
		transferFundsBackToPoolInternal(_reserve, totalDebt);

		// Loan paid back
		emit LoanCompleted(
            _reserve,
						_amount,
            _fee
        );
	}

  /// Attempt to retrieve a flashloan for requested amount
	/// @notice Uses Aave V1 which only requires 1 asset address to be passed
	/// @dev Caller must deposit premium before requesting a FlashLoan
	/// @param token Token address for the asset User wants to loan
	/// @param amount Amount of tplem to request for the loan
	function initiateFlashLoan(address token, uint256 amount) public onlyOwner {
		bytes memory params = "";

		// Uses Aave V1 addressProvider
		ILendingPool lendingPool = ILendingPool(addressesProvider.getLendingPool());

		// Request loan for amount of token
		lendingPool.flashLoan(address(this), token, amount, params);

		// Loan request sent
		emit LoanInitiated(token, amount);
	}

  /// Withdraw funds to receiver
	function emptyTheBank(address receiver) public onlyOwner {
		require(address(this).balance > 0, "Balance is empty");
		payable(receiver).transfer(address(this).balance);
	}
}
