pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {IPureFiVerifier,PureFiData} from "@purefi/sdk-solidity-v5/src/interfaces/IPureFiVerifier.sol";
import "@purefi/sdk-solidity-v5/src/libraries/PureFiDataLibrary.sol";

contract PrimitiveWhitelist is OwnableUpgradeable {
    using PureFiDataLibrary for bytes;
    uint256 public ruleID;
    IPureFiVerifier public verifier;
    mapping(address => bool) public whitelistData;

    event Whitelisted(address indexed userAddress);

    function initialize(address _purefiVerifier, uint256 _ruleID) external initializer {
        __Ownable_init_unchained(msg.sender);
        ruleID = _ruleID;
        verifier = IPureFiVerifier(_purefiVerifier);
    }

    function setRuleId(uint _ruleId) external onlyOwner {
        ruleID = _ruleId;
    }

    function whitelist(bytes calldata _purefidata) public returns (bool succeed){
        verifier.validatePayload(_purefidata);
        bytes calldata package = _purefidata.getPackage();
        require(package.getRule() == ruleID, "Invalid ruleId");
        whitelistData[_msgSender()] = true;
        emit Whitelisted(_msgSender());
        return true;
    }
}
