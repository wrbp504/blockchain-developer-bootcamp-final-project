const CryptoJS = window.CryptoJS;
var ckjson;
var hash;

async function loadJSON() {
  const response = await fetch('../../build/contracts/ContractKeeper.json');
  ckjson = await response.json();
}

loadJSON();

async function selectedAddress() {
  const accounts = await ethereum.request({
    method:
      'eth_requestAccounts'
  });
  if (typeof accounts !== 'undefined') {
    return accounts[0].toLowerCase();
  }
  return "";
}

ethereum.on('accountsChanged', function (accounts) {
  verifyContract();
})

window.addEventListener('load', function () {
  if (typeof window.ethereum !== 'undefined') {
    let mmDetected = document.getElementById('mm-detected')
    mmDetected.innerHTML = "Metamask Has Benn Detected!"
  }
  else {
    this.alert("You need to install Metamask")
  }
})

const mmEnable = document.getElementById('mm-connect')
var accounts;
mmEnable.onclick = async () => {
  accounts = await ethereum.request({
    method:
      'eth_requestAccounts'
  });

  const mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = accounts[0];
}

const ckInputFile = document.getElementById('ck-file');
ckInputFile.onchange = async (event) => {
  const file = event.target.files.item(0);
  const ckFname = document.getElementById('ck-fname');
  ckFname.innerHTML = "  " + file.name;

  var reader = new FileReader();
  var binaryString;

  reader.onload = function () {
    binaryString = reader.result;
    hash = CryptoJS.SHA256(binaryString);
    document.getElementById("ck-content").innerText = hash.toString(CryptoJS.enc.Hex);
    const pdfvisor = document.getElementById("pdfvisor");
    pdfvisor.src = "data:application/pdf;base64, " + encodeURI(btoa(binaryString));
    verifyContract();
  }
  reader.readAsBinaryString(file);
}

const ckFile2 =document.getElementById("ck-file2");
ckFile2.onclick = async () =>{
  document.getElementById("ck-file").click();
}
 

const ckAdd = document.getElementById("ck-add");
ckAdd.onclick = async () => {
  if (selectedAddress() == null) {
    alert("Please connect to Metamask");
    return;
  }
  document.getElementById('ck-submit').style.display = "";

  const details = document.getElementById("details");
  details.innerHTML = `
  <label>Signer 1:</label>
  <div id="account1"  style="color: white;width:95%"></div>
  <input id="name1" type="text" placeholder="Name1" style="width:95%">
  <br><label>Signer 2:</label>
  <input id="account2" type="text" placeholder="Account2" style="width:95%">
  <input id="name2" type="text" placeholder="Name2" style="width:95%">
  <br><label>Signer 3:</label>
  <input id="account3" type="text" placeholder="Account3" style="width:95%">
  <input id="name3" type="text" placeholder="Name3" style="width:95%">
  `
  const account1 = document.getElementById("account1");
  account1.innerHTML = await selectedAddress();
};


async function verifyContract() {
  var SCResponse;
  var accounts;
  
  const details = document.getElementById("details");
  details.innerHTML = `
  <label>Signer 1:</label>
  <div id="account1"  style="color: white;width:95%"></div>
  <div id="name1"  style="color: white;width:95%"></div>
  <br>
  <label>Signer 2:</label>
  <div id="account2"  style="color: white;width:95%"></div>
  <div id="name2"  style="color: white;width:95%"></div>
  <br>
  <label>Signer 3:</label>
  <div id="account3"  style="color: white;width:95%"></div>
  <div id="name3"  style="color: white;width:95%"></div>
  <br>
  `
  const account1 = document.getElementById("account1");
  const name1 = document.getElementById("name1");
  const account2 = document.getElementById("account2");
  const name2 = document.getElementById("name2");
  const account3 = document.getElementById("account3");
  const name3 = document.getElementById("name3");

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const contractKeeper = new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);

  try {
    SCResponse = await contractKeeper.methods.getLegalContract("0x" + hash.toString(CryptoJS.enc.Hex)).call();
  } catch (error) {
    account1.innerHTML = "Contract not created";
    document.getElementById('ck-add').style.display = "";
    document.getElementById('ck-submit').style.display = "none";
    document.getElementById('ck-sign').style.display = "none";
    return false;
  }

  const legalContract = SCResponse[0];

  account1.innerHTML =  legalContract.signers[0] + (SCResponse[1][0] ? " Signed" : " Not Signed");
  name1.innerHTML =   legalContract.signersNames[0];

  account2.innerHTML =  legalContract.signers[1] + (SCResponse[1][1] ? " Signed" : " Not Signed");
  name2.innerHTML =  legalContract.signersNames[1];


  if (legalContract.signers.length == 3) {

    account3.innerHTML =   legalContract.signers[2] + (SCResponse[1][2] ? " Signed" : " Not Signed");;
    name3.innerHTML =   legalContract.signersNames[2];

  } else {
    account3.innerHTML = "---"
    name3.innerHTML = "---";
  }

  document.getElementById('ck-add').style.display = "none";
  document.getElementById('ck-submit').style.display = "none";
  selAdd = await selectedAddress();
  document.getElementById('ck-sign').style.display = "none";
  for (i = 0; i < legalContract.signers.length; i++) {
    if (legalContract.signers[i].toLowerCase().localeCompare(selAdd) == 0 && !SCResponse[1][i]) {
      document.getElementById('ck-sign').style.display = "";
      break;
    }
  }
  return true;
}

const ckSubmit = document.getElementById("ck-submit");
ckSubmit.onclick = async () => {

  const account1 = document.getElementById('account1');
  if (!/^0[xX][0-9a-fA-F]{40}$/.test(account1.innerHTML)) {
    alert("Invalid account 1 format");
    return;
  }
  const name1 = document.getElementById('name1');
  if (name1.value === "") {
    alert("Name 1 Should not be empty");
    return;
  }

  var accs = [account1.innerHTML];
  var names = [name1.value];

  const account2 = document.getElementById('account2');
  if (!/^0[xX][0-9a-fA-F]{40}$/.test(account2.value)) {
    alert("Invalid account 2 format");
    return;
  }
  accs.push(account2.value);

  const name2 = document.getElementById('name2');
  if (name2.value === "") {
    alert("Name 2 Should not be empty");
    return;
  }
  names.push(name2.value);

  const account3 = document.getElementById('account3');
  if (account3.value !== "" && !/^0[xX][0-9a-fA-F]{40}$/.test(account3.value)) {
    alert("Invalid account 3 format");
    return;
  }

  const name3 = await document.getElementById('name3');
  if (account3.value !== "" && name3.value === "") {
    alert("Name 3 Should not be empty");
    return;
  }

  if (account3.value !== "") {
    accs.push(account3.value);
    names.push(name3.value);
  }

  if (!account1.innerHTML.toLowerCase().localeCompare(account2.value.toLowerCase()) ||
      !account1.innerHTML.toLowerCase().localeCompare(account3.value.toLowerCase()) ||
      !account2.value.toLowerCase().localeCompare(account3.value.toLowerCase())) 
  {
    alert("account should have different values");
  }


  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();


  const contractKeeper = new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);
  
  const response = await contractKeeper.methods
    .addLegalContract("0x" + hash.toString(CryptoJS.enc.Hex),
      accs,
      names).send({ from: await selectedAddress(), value: 1 });

  verifyContract();
}

const ckSign = document.getElementById("ck-sign");
ckSign.onclick = async () => {

  var web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const contractKeeper = new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);

  const response = await contractKeeper.methods
    .signContract("0x" + hash.toString(CryptoJS.enc.Hex)).send({ from: await selectedAddress() });

  verifyContract();
}