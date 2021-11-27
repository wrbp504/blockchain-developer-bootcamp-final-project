# Final Project - Contract Integrity verifier

## Deployed version url:

https://wrbp504.github.io

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- npm
- `git`

### Contracts

- Clone repository `git clone https://github.com/wrbp504/blockchain-developer-bootcamp-final-project` 
- Run `npm install` in project root to install dependencies
- Run local testnet (depending on the command used port could be `7545 or 8545 or 9545`
- Add this local testnet to Metamask http://127.0.0.1:port/ with Chain Id 1337 (see line above for port), truffle develop uses 9545, ganache-cli uses by default port 8545
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- `development` network id is 5337 and Chain Id (the Used to configure Metamask)  is 1337 .

### Frontend

- `cd client`
- `npm install`
- `npm start`
- Open `http://127.0.0.1:8080`

### How to populate locally deployed contract with listings

- `truffle migrate --network development`
- `truffle console --network development`
- `let ck = await ContractKeeper.deployed()`
- Send ETH to local wallet: `web3.eth.sendTransaction({ from: "<your local address>", to: "<your local network wallet>", value: web3.utils.toWei("10") })`
- `cd client && npm start`
- Open local ui from `http://localhost:3000`
- Make sure your Metamask localhost network is in port `7545` and chain id is `1337`.
- If you get `TXRejectedError` when sending a transaction, reset your Metamask account from Advanced settings.

## Screencast link



## Project description

The idea is that 2 or 3 parties agree to a document (Legal contract), save the hash of the document in the Blockchain and certify their agreement to the document containing the agreement (actually the hash of the document) by signing, so in the future anyone can verify if the document in thier possesion is an unmodified copy of the original agreement.

## Simple workflow

1. Enter the site
2. The first party Select or drop a PDF document for the hash to be calculated.
3. The  he adds the legal contract (hash) by providing the public addresses and names (or description or nicknames) for the signers (parties).
4. Each party added in previous step need to enter the site, provide their copy of the document so the contract can be retrived an signed. If the second party does no fin ¿d the contract, means his copy is not the same as the one used to add the contract.
5. After all parties sign the contract, anyone can go to the site with a copy of the document and verify if it is an unmodified copy of the one used to create the register.


## Directory structure

- `client`: Contains the files for the frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## deployment on external  with Truffle
2 additional files (not incuded) are needed to deply for ropsten:

1. .testwallet tha contain the nemonic if the wallet containing the test ETH.
2. .ropsteninfura with the url containig the project id of infura. 