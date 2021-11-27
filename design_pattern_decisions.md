# Design Pattern Decisions

## Inheritance and Interfaces
The contract Iherits from `https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol`

## Access Control Design Patterns
We used the Ownable access control to restrict functions that require the owner of the contract to be executed.
- removeLegalContract: this function removes from storage a registered contract.
- destroyContract: to delf destruct the smart contract.