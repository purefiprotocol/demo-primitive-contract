pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {IPureFiVerifier,PureFiData} from "@purefi/sdk-solidity-v5/src/interfaces/IPureFiVerifier.sol";
import "@purefi/sdk-solidity-v5/src/libraries/PureFiDataLibrary.sol";

contract PrimitiveContract is OwnableUpgradeable {
    using PureFiDataLibrary for bytes;
    uint256 public ruleID;
    IPureFiVerifier public verifier;

    event DemoPurchase(address indexed recepient, uint256 amount);

    function initialize(address _purefiVerifier, uint256 _ruleID) external initializer {
        __Ownable_init_unchained(msg.sender);
        ruleID = _ruleID;
        verifier = IPureFiVerifier(_purefiVerifier);
    }

    function setRuleId(uint _ruleId) external onlyOwner {
        ruleID = _ruleId;
    }

    function callWithPurefi(
        address _to,
        uint256 _amount,
        bytes calldata _purefidata
    )
    external
    payable
    {
        verifier.validatePayload(_purefidata);
        bytes calldata package = _purefidata.getPackage();
        require(package.getRule() == ruleID, "Invalid ruleId");
        (address _tokenAddress, uint256 _tokenAmount) = package.getTokenData0();
        require(_tokenAmount >= _amount, "Limit exceed");

        emit DemoPurchase(_to, _amount);
    }
}
