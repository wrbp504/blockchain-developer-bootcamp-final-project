# Final Project - Contract Integrity verifier

## Deployed version url:

https://wrbp504.github.io

## How to run this project locally:

### Prerequisites

- Node.js >= v14 & <=16.13.0 `ganache-cli do not work with latest node vesion.`
- Truffle and Ganache
- npm
- `git`

### Contracts

- Clone repository `git clone https://github.com/wrbp504/blockchain-developer-bootcamp-final-project` 
- Run `npm install` in project root to install dependencies
- Run local testnet `ganache-cli --networkId 5777`
- Add this local testnet to Metamask `http://127.0.0.1:8545` with Chain Id `1337` 
- `truffle migrate --network develop`
- `truffle console --network develop`
- Run tests in Truffle console: `test`

### Frontend

- `cd client`
- `npm install`
- `npm start`
- Open `http://127.0.0.1:8080`
- Some test pdf files are included on  `testfiles` directory 

## Screencast link

https://youtu.be/U2PMAXeVWSc

## Project description

The idea is that 2 or 3 parties agree to a document (Legal contract), save the hash of the document in the Blockchain and certify their agreement to the document  (actually the hash of the document) by signing, so in the future anyone can verify if the document in thier possesion is an unmodified copy of the original agreement.

## Simple workflow

1. Enter the site
2. The first party Select a PDF document for the hash to be calculated.
3. Then adds the legal contract (hash) by providing the public addresses and names (or description or nicknames) for the signers (parties). There is maximun of 3 parties.
4. Each party added in the previous step need to enter the site, provide their copy of the document so the contract can be retrived an signed. If the second party does no find the contract, it means his copy is not the same as the one used to add the contract.
5. After all parties sign the contract, anyone can go to the site with a copy of the document and verify if it is an unmodified copy of the one used to create the register.

## Directory structure

- `client`: Contains the files for the frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.
- `testfiles` pdf files fpr testing

## deployment on external  with Truffle
2 additional files (not incuded) are needed to deploy on ropsten:

1. .testwallet tha contain the nemonic if the wallet containing the test ETH.
2. .ropsteninfura with the url containig the project id of infura. 

## abi and deployment address
The third step in migrations scripts creates a reduced json file of the contract containing the abi and deployment addresses by network to be used by the client. 