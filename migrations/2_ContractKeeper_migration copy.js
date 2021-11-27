const ContractKeeper = artifacts.require("ContractKeeper")

module.exports = async function (deployer) {
  await deployer.deploy(ContractKeeper);
}