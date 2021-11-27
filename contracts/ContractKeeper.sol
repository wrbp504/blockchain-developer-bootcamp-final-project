// SPDX-License-Identifier: MIT
pragma solidity 0.8.9 ;

/// @title Contract/document integrity verificator
/// @author Wilhelm Bendeck
/// @notice Contract keeps on public chain hash of document signed by interested parties to verify in the future with hash
/// @dev no issues at this point

//used for test on remix
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ContractKeeper is Ownable{

  enum State { NotCreated, Created, Signed }

  struct LegalContract {
    address[] signers; //array witn the addresses of the signers
    string[] signersNames; //array with names, description or nicnames of the signers
    uint256 noOfSignatures; //number of signers that alredy signed
    State state; //state of the contract
    uint256 index; //index in the contracts list
  }
  
 struct SigControl {
     bool isSigner;
     bool hasSigned;
 }
 
  mapping (uint => LegalContract) legalContracts; //lchash => LegalContract.
  mapping (uint => mapping (address => SigControl)) sigControl; //signer => Contract => signature state
  //mapping (address => Signer) signersRegister;
  uint[] public contractsList;


  modifier isSigner(uint256 lchash){
    require(sigControl[lchash][msg.sender].isSigner, "Sender is not signer of this contract");
    _;
  }

  modifier isSignable(uint256 lchash){
    require(legalContracts[lchash].state == State.Created,"Contract does not exist or is already signed");
    _;
  }

  modifier exist(uint256 lchash){
    require(legalContracts[lchash].state != State.NotCreated,"Contract does not exist");
    _;
  }

  modifier verifySigners( address[] calldata signers,string[] calldata names){
    require(signers.length == names.length, "Number of signers and names are nor equal");
    require(signers.length >1 && signers.length <= 3,"Invalid numer of signers");
    //this is limited loop of 3 accounts max
    for (uint256 i=0; i<signers.length;i++){
      require(signers[i]!=address(0), "Signer address not valid");
    }
    _;  
  }

  modifier isNotCreated(uint256 lchash){
    require(legalContracts[lchash].state == State.NotCreated, "Contract already exist");
    _;
  }
  modifier notSigned(uint256 lchash){
    require(!sigControl[lchash][msg.sender].hasSigned , "Sender already signed");
    _;
  }
  
  event LegalContractAdded(uint256 lchash);
  event LegalContractSigned(uint256 lchash, address signer);
  event LegalContractRmoved(uint256 lchash);
  
/// @notice adds a new contract hash for future signing and verification
/// @param lchash hash of the document to be keep and used for verification
/// @param signers array with signers addresses
/// @param names array with a description of each signer
/// @return true if succesful in adding contract
  function addLegalContract ( uint256 lchash ,address[] calldata signers,string[] calldata names )
    public
    payable
    verifySigners(signers,names)
    isNotCreated(lchash)
    returns(bool)
  {
    require(msg.value >= 1 wei,"Not Enough funds");
    for (uint i = 0; i < signers.length; i++){
        sigControl[lchash][signers[i]] = SigControl({
            isSigner: true,
            hasSigned: false
        });
        
    }
    legalContracts[lchash] = LegalContract({
        signers: signers,
        signersNames: names,
        noOfSignatures: 0,
        state: State.Created,
        index: contractsList.length
    });

    contractsList.push(lchash);
    emit LegalContractAdded(lchash);
    return true;
  }
  
  /// @notice return legal contract data
  /// @param lchash hash of legal contract to be retrived
  /// @return (legal contract struct,  boolean[] with signing status of each signer)
  
  function getLegalContract(uint256 lchash)
    public
    view
    exist(lchash)
    returns(LegalContract memory, bool[] memory){
      bool[] memory signs = new bool[](legalContracts[lchash].signers.length);
      for (uint8 i=0;i<legalContracts[lchash].signers.length;i++){
        signs[i]=sigControl[lchash][legalContracts[lchash].signers[i]].hasSigned;

      }
    return (legalContracts[lchash], signs);
  }
  
  /// @notice called by signer to sign a contract
  /// @param lchash hash of the contract to be sogned
  /// @return true if contract is signed succesfully
  
  function signContract(uint256 lchash) 
    public
    isSigner(lchash)
    isSignable(lchash)
    notSigned(lchash)
    returns(bool)
  {
       
      sigControl[lchash][msg.sender].hasSigned = true;
      legalContracts[lchash].noOfSignatures ++;
      if (legalContracts[lchash].noOfSignatures == legalContracts[lchash].signers.length){
          legalContracts[lchash].state = State.Signed;
      }
      emit LegalContractSigned(lchash, msg.sender);
      return true;
  }

/// @notice call by the owner to remove a contract
/// @dev before using consider the gas cost of removing the data
/// @param lchash hash of the contract to be removed
/// @return true if contract is succesfully removed
  function removeContract (uint256 lchash) exist(lchash) onlyOwner public returns(bool) {
    //TODO
    LegalContract storage toRemove = legalContracts[lchash];
    LegalContract storage last = legalContracts[contractsList[contractsList.length-1]];
    contractsList[toRemove.index]=contractsList[last.index];
    contractsList.pop();
    for (uint256 i = 0; i<toRemove.signers.length; i++){
        delete(sigControl[lchash][toRemove.signers[i]]);
    }
    delete(legalContracts[lchash]);
    return true;
  }

/// @notice return collected fees to owner
/// @return balance trabnsferred to owner
function  collectFees()
  onlyOwner
  public
  returns (uint256) {
    uint256 balance = address(this).balance;
    if (balance>0){
      (bool sent, bytes memory data) = owner().call{value: balance}("");
      require(sent,"Failed to send Ether to owner");
    }
  return balance;
}


/// @notice function to destroy deployed contract
  function destroyContract()
    onlyOwner 
    public {
    selfdestruct(payable(msg.sender));
  }
}
