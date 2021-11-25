const ContractKeeper = artifacts.require("ContractKeeper")

module.exports = function (deployer) {
  deployer.deploy(ContractKeeper);
}