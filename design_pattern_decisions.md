# Design Pattern Decisions

## Inheritance and Interfaces
The contract Iherits from `https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol`

## Access Control Design Patterns
We used the Ownable access control to restrict functions that require the owner of the contract to be executed.
- removeLegalContract: this function removes from storage a registered contract.
- destroyContract: to self destruct the smart contract.

## Saving gas
As the hash of the document is caluclated outside the blockchain, dicided to use a 256 bit hash to be saved as a uint256 instead of using 64 bytes required to save the hexadecimal representation of the hash.