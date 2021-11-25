// SPDX-License-Identifier: MIT
pragma solidity 0.8.9 ;
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract ContractKeeper is Ownable{

  enum State { NotCreated, Created, Signed }
  uint256 balance;

  struct LegalContract {
    address[] signers;
    string[] signersNames;
    uint256 numSigners;
    State state;
  }
  
 struct SigControl {
     bool isSigner;
     bool hasSigned;
 }
 
  mapping (uint => LegalContract) legalContracts; //lchash => LegalContract
  mapping (uint => mapping (address => SigControl)) sigControl; //signer => Contract => signature state
  //mapping (address => Signer) signersRegister;
  uint[] contractsIdx;

  constructor()  {
  }

  modifier isSigner(uint256 lchash){
    require(sigControl[lchash][msg.sender].isSigner, "Sender is not signer of this contract");
    _;
  }

  modifier isCreated(uint256 lchash){
    require(legalContracts[lchash].state == State.Created,"Contract not exist");
    _;
  }

  modifier exist(uint256 lchash){
    require(legalContracts[lchash].state != State.NotCreated,"Contract not exist");
    _;
  }

  modifier verifySigners( address[] calldata signers,string[] calldata names){
    require(signers.length == names.length, "Number of signers and names are nor equal");
    require(signers.length >1 && signers.length <= 3,"Ivalid numer of signers");
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

  function getContractSigners(uint256 lchash)
    public
    view 
    isCreated(lchash)
    returns(address[] memory,string[] memory )
  {
      return (legalContracts[lchash].signers,legalContracts[lchash].signersNames);
  }
  
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
        numSigners: 0,
        state: State.Created
    });
    contractsIdx.push(lchash);
    emit LegalContractAdded(lchash);
    return true;
  }
  
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
  
  function signContract(uint256 lchash) 
    public
    isSigner(lchash)
    isCreated(lchash)
    notSigned(lchash)
    returns(bool)
  {
       
      sigControl[lchash][msg.sender].hasSigned = true;
      legalContracts[lchash].numSigners ++;
      if (legalContracts[lchash].numSigners == legalContracts[lchash].signers.length){
          legalContracts[lchash].state = State.Signed;
      }
      emit LegalContractSigned(lchash, msg.sender);
      return true;
  }
  
  function removeContract  (uint256 lchash) onlyOwner public {
    //TODO
  }

  function destroyContract() onlyOwner public {
    selfdestruct(payable(msg.sender));
  }
}
