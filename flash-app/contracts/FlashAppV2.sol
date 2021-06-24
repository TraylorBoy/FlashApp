// SPDX-License-Identifier: MIT


pragma solidity 0.6.12;

import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";
import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import { SafeMath } from "./Libraries.sol";

contract FlashAppV2 is FlashLoanReceiverBase {
  using SafeMath for uint256;

  constructor(ILendingPoolAddressesProvider provider)
    public
    FlashLoanReceiverBase(provider)
    {}

  event LoanInitiated(
    address initiator,
    address token,
    uint amount
  );

  event LoanComplete(
    address initiator,
    address reserve,
    uint amount,
    uint fee
  );

  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata
  )
    external
    override
    returns (bool)
  {
    // Contract has funds
    // It will now pay back debt for all assets loaned
    // and emit LoanComplete event for each asset
    for (uint i = 0; i < assets.length; i++) {
      uint owing = amounts[i].add(premiums[i]);
      IERC20(assets[i]).approve(address(LENDING_POOL), owing);
      emit LoanComplete(initiator, assets[i], amounts[i], premiums[i]);
    }

    return true;
  }

  function requestLoanFor(address token, uint amount) public {
    address receiver = payable(address(this));
    address onBehalfOf = payable(msg.sender);

    address[] memory assets = new address[](1);
    uint256[] memory amounts = new uint256[](1);
    uint256[] memory modes = new uint256[](1);
    bytes memory params = "";
    uint16 referralCode = 0;

    assets[0] = token;
    amounts[0] = amount;
    modes[0] = 0;

    LENDING_POOL.flashLoan(
      receiver,
      assets,
      amounts,
      modes,
      onBehalfOf,
      params,
      referralCode
    );

    emit LoanInitiated(onBehalfOf, token, amount);
  }
}
