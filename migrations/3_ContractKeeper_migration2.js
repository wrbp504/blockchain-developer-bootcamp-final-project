const ContractKeeper = artifacts.require("ContractKeeper")

module.exports =  function (deployer) {
  
  const fs = require('fs')

  ckjson= JSON.parse(fs.readFileSync('build/contracts/ContractKeeper.json'))

  let reducedJson = {};
  reducedJson["abi"] = ckjson.abi;
  let keys = Oject.keys(cjson.networks);
  reducedJson["networks"] = {};
  for (var i=0;i<keys.length;i++){
    reducedJson["networks"][keys[i]].address=ckjson.networks[keys[i]].address;
  }

  fs.writeFile('./client/contracts/ContractKeeperReduced.json', JSON.stringify(reducedJson,null,2), (error) => {
    if (error) {
      console.log(`Error occurs, Error code -> ${err.code},
      Error No -> ${err.errno}`);
      throw error;
    }
  });
}