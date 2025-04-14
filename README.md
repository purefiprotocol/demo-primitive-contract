# PureFi Integration Example

This project demonstrates how to integrate PureFi's verification system into a Solidity smart contract. It includes a sample contract that uses PureFi's verification service to validate transactions. This example relies on PureFi SDK v5. 

## Project Overview

The project consists of:
- `PrimitiveContract.sol`: A sample contract that integrates with PureFi's verification system
- `DeployPrimitiveContract.ts`: Script for deploying and upgrading the contract

## Prerequisites

- Node.js and npm
- Hardhat
- An Ethereum wallet with testnet funds (for deployment)
- OpenZeppelin 5
- PureFi SDK v5 (`npm i @purefi/sdk-solidity-v5`)
- Active PureFi subscription in the destination blockchain.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create and configure your environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Add your private key
- Configure network settings
- Set PureFi verifier address

## Deployment

### Initial Deployment
To deploy the contract for the first time:
```bash
npx hardhat run scripts/DeployPrimitiveContract.ts --network <network-name>
```

### Contract Upgrade
To upgrade an existing contract:
1. Modify the `deployPrimitiveContract` function in `DeployPrimitiveContract.ts`
2. Set `if(false)` to `if(true)` in the deployment section
3. Run the deployment script again

## Contract Usage

The `PrimitiveContract` provides the following main functions:

- `initialize(address _purefiVerifier, uint256 _ruleID)`: Initializes the contract with PureFi verifier and rule ID
- `setRuleId(uint _ruleId)`: Updates the rule ID (owner only)
- `callWithPurefi(address _to, uint256 _amount, bytes calldata _purefidata)`: Executes a transaction with PureFi verification


## Configuration

The contract uses the following default configuration:
- PureFi Verifier: `0xA76EB19EE74b7A69D2549E92764947AdeA3be714` - in Sepolia testnet
- Rule ID: `431050` (alternatively, take the one from [PureFi Playground](https://playground.purefi.io))

## Security Considerations

- The contract uses OpenZeppelin's upgradeable contracts pattern
- All sensitive operations are protected by the `onlyOwner` modifier
- PureFi verification is required for all transactions

## License
MIT
