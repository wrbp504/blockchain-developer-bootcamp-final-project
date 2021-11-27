const ContractKeeper = artifacts.require("ContractKeeper")

module.exports =  function (deployer) {
  
  const fs = require('fs')

  ckjson= JSON.parse(fs.readFileSync('build/contracts/ContractKeeper.json'))

  let reducedJson = {};
  reducedJson["abi"] = ckjson.abi;
  reducedJson["networks"] = ckjson.networks;

  fs.writeFile('./client/contracts/ContractKeeperReduced.json', JSON.stringify(reducedJson,null,2), (error) => {
    if (error) {
      console.log(`Error occurs, Error code -> ${err.code},
      Error No -> ${err.errno}`);
      throw error;
    }
  });
}