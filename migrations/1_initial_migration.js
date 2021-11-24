const Migrations = artifacts.require("Migrations");
const ContractKeeper = artifacts.require("ContractKeeper")
const SimpleStorage = artifacts.require("SimpleStorage")

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ContractKeeper);
  deployer.deploy(SimpleStorage);

};
