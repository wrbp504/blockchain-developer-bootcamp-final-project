let BN = web3.utils.BN;
let ContractKeeper = artifacts.require("ContractKeeper");
let { catchRevert } = require("./exceptionsHelpers.js");
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("ContractKeeper", function (accounts) {
  const [_owner, first, second, third] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instance;

  beforeEach(async () => {
    instance = await ContractKeeper.new();
  });

  describe("Variables", () => {
    it("should have an owner", async () => {
      assert.equal(typeof instance.owner, 'function', "the contract has no owner");
    });


    describe("enum State", () => {
      let enumState;
      before(() => {
        enumState = ContractKeeper.enums.State;
        assert(
          enumState,
          "The contract should define an Enum called State"
        );
      });

      it("should define `NotCreated`", () => {
        assert(
          enumState.hasOwnProperty('NotCreated'),
          "The enum does not have a `NotCreated` value"
        );
      });

      it("should define `Created`", () => {
        assert(
          enumState.hasOwnProperty('Created'),
          "The enum does not have a `Created` value"
        );
      });

      it("should define `Signed`", () => {
        assert(
          enumState.hasOwnProperty('Signed'),
          "The enum does not have a `Signed` value"
        );
      });

    })

  });  
  describe("Use cases", () => {
    it("should add a contract with provide signers and names", async () => {
      await instance.addLegalContract(2,[first, second],["first","second"], { from: first, value: 1 });

      const result = await instance.getLegalContract.call(2);
      console.log("\n********************************\n");
      console.log("result[0] " + result[0]);
      console.log("result[0][0] " + result[0][0]);
      console.log("result[0][0][0] " + result[0][0][0]);
      console.log("result[0][0][1] " + result[0][0][1]);
      console.log("result[1]" + result[1]);
      
      assert.equal(
        result[0][0][0],
        first,
        `first signer do not match first signer sent `,
      );
      assert.equal(
        result[0][0][1],
        second,
        `second signer do not match second signer sent `,
      );
      assert.equal(
        result[0][1][0],
        "first",
        `first signer name do not match first signer name sent `,
      );
      assert.equal(
        result[0][1][1],
        "second",
        `second signer name do not match second signer name sent `,
      );

    });

    it("should emit a LegalContractAdded event when a contract is added", async () => {
      let eventEmitted = false;
      const tx = await  instance.addLegalContract(3,[first, second],["first","second"], { from: first, value: 1 });

      if (tx.logs[0].event == "LegalContractAdded") {
        eventEmitted = true;
      }

      assert.equal(
        eventEmitted,
        true,
        "adding a contract should emit a Legal Contract Added  event",
      );
    });

    it("should error when not enough value is sent to add contract", async () => {
      await catchRevert( instance.addLegalContract(4,[first, second],["first","second"], { from: first, value: 0 }));
     
    });

    it("should error when other user call an onlyOwner function", async () => {
      await catchRevert( instance.destroyContract( { from: first}));
     
    });
    it("should perform function with onlyOwner when owner calls", async () => {
      
      await  instance.destroyContract( { from: _owner});  
     
    });

  });

});
