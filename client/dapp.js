const CryptoJS = window.CryptoJS;
let ckjson;
let hash;


async function loadJSON() {
  const response = await fetch('./contracts/ContractKeeperReduced.json');
  ckjson = await response.json();
}
loadJSON();

async function selectedAddress() {
  if (typeof window.ethereum !== 'undefined') {

    var accounts = await ethereum.request({
      method:
        'eth_accounts'
    });

    if (accounts.length == 0) {
      accounts = await ethereum.request({
        method:
          'eth_requestAccounts'
      });
    }

    if (accounts.length !== 0) {
      await setHandlers();
      return accounts[0].toLowerCase();
    }
  }
  alert("Need to accept connection for this contract function");
  return "";
}

async function setHandlers() {
  ethereum.on('accountsChanged',  (accounts) =>{
    document.getElementById('mm-account').innerHTML = 
     "<strong>SELECTED " +accounts[0]+"</strong>";
    verifyContract();
  } );
  ethereum.on('chainChanged', (_chainId) => window.location.reload());
}

window.addEventListener('load', async function () {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
  } else {
    var accounts = await ethereum.request({
      method:
        'eth_accounts'
    });
    if (accounts.length>0){
      document.getElementById('mm-account').innerHTML = "<strong>SELECTED " +accounts[0]+"</strong>";

    } else{
      document.getElementById('mm-account').innerHTML = "Metamask not connected";
    }
    setHandlers();
  }
})

const ckInputFile = document.getElementById('ck-file');
ckInputFile.onchange = async (event) => {
  const file = event.target.files.item(0);
  let fl = file.name.length;
  if (fl < 4 || String(file.name).substring(fl - 4, fl).toLowerCase().localeCompare(".pdf")) {
    alert("invalid file type, must be pdf");
    return;
  }
  const ckFname = document.getElementById('ck-fname');
  ckFname.innerHTML = "  " + file.name;

  let reader = new FileReader();
  let binaryString;

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

const ckFile2 = document.getElementById("ck-file2");
ckFile2.onclick = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
    return;
  }
  document.getElementById("ck-file").click();
}

function getReason(err) {
  const reason = { reason: "", message: "", other: "" };
  reason.message = "";

  getReason2(err, reason);
  if (reason.reason !== "") return reason.reason;
  if (reason.message !== "") return reason.message;
  return reason.other;

}

function getReason2(err, reason) {
  console.log("Entrado en get reason " + typeof err);
  console.log("err " + err);
  console.log("reason" + String(reason));


  let pos = String(err).search("{");
  console.log("Primer pos " + pos);

  if (pos > 1) {
    let pos2 = String(err).lastIndexOf("}") + 1;
    let errjson = JSON.parse(String(err).substring(pos, pos2));
    getReason2(errjson, reason);
    return;
  }
  else if (typeof err === 'object') {
    let keys = Object.keys(err);
    console.log("keys " + keys);

    if (keys.length == 0) {
      reason.other = String(err);
      return;
    }

    for (var i = 0; i < keys.length; i++) {
      console.log(keys[i] + "-->" + err[keys[i]]);
      if (!keys[i].localeCompare("reason")) {
        console.log("reason==> " + err["reason"]);
        reason.reason = err["reason"]
        return;
      }
      if (!keys[i].localeCompare("message")) {
        console.log("message==> " + err["message"]);
        let msg = err["message"];
        let pos3 = msg.search(":");
        if (pos3 > 0) {
          reason.message = msg.substring(pos3 + 2)
        }
      }
      if (typeof err[keys[i]] === 'object') {
        getReason2(err[keys[i]], reason);
        if (reason.reason !== "") return;
      } else {
        if (err[keys[i]] != null) {
          reason.other = String(err[keys[i]]);
        }
      }
    }
  }
  return;
}



const ckAdd = document.getElementById("ck-add");
ckAdd.onclick = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
    return;
  }
  if (selectedAddress() == null) {
    alert("Please connect to Metamask");
    return;
  }
  ckAdd.style.display = "none";
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
  document.getElementById("message-area").innerHTML = "Beware that form will be reset if new account is selected in Metamask!!!!"
};


async function verifyContract() {
  let SCResponse;
  let accounts;

  if(!document.getElementById("ck-content").innerText.localeCompare( "")){
      return;
  }

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

  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
    return;
  }
  let web3 = new Web3(window.ethereum)
  web3.eth.handleRevert = false;
  const networkId = await web3.eth.net.getId();

  console.log("NetworkId " + networkId);

  if (typeof ckjson.networks[networkId] === 'undefined') {
    alert("contract not deployed on NetwordId " + networkId);
    return;
  }

  console.log("ckjson.networks[networkId].address " + ckjson.networks[networkId].address);

  const contractKeeper = await new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);





  try {
    SCResponse = await contractKeeper.methods.getLegalContract("0x" + hash.toString(CryptoJS.enc.Hex)).call();
  } catch (err) {
    account1.innerHTML = "";
    document.getElementById('ck-add').style.display = "";
    document.getElementById('ck-submit').style.display = "none";
    document.getElementById('ck-sign').style.display = "none";
    document.getElementById("message-area").innerHTML = getReason(err);

    return false;
  }

  const legalContract = SCResponse[0];

  account1.innerHTML = legalContract.signers[0] + "<strong>" + (SCResponse[1][0] ? " SIGNED" : " NOT SIGNED") + "</strong>";
  name1.innerHTML = legalContract.signersNames[0];

  account2.innerHTML = legalContract.signers[1] + "<strong>" + (SCResponse[1][1] ? " SIGNED" : " NOT SIGNED") + "</strong>";
  name2.innerHTML = legalContract.signersNames[1];

  if (legalContract.signers.length == 3) {

    account3.innerHTML = legalContract.signers[2] + "<strong>" + (SCResponse[1][2] ? " SIGNED" : " NOT SIGNED") + "</strong>";
    name3.innerHTML = legalContract.signersNames[2];

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
  switch (parseInt(legalContract.state)) {
    case 1:
      document.getElementById("message-area").innerHTML = "Accounts labeled NOT SIGNED, must be selected first in Metamask to sign";
      break;
    case 2:
      document.getElementById("message-area").innerHTML = "Already signed contracts are view only";
      break;
    case 0:
      document.getElementById("message-area").innerHTML = "Click Add Contract to add contract"
      break;
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

  let accs = [account1.innerHTML];
  let names = [name1.value];

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
    !account2.value.toLowerCase().localeCompare(account3.value.toLowerCase())) {
    alert("account should have different values")
    return;
  }

  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
    return;
  }

  let web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const contractKeeper = new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);

  document.getElementById("message-area").innerHTML = "PROCESSING PLEASE WAIT";
  console.log("PROCCESSING");

  try {
    const response = await contractKeeper.methods
      .addLegalContract("0x" + hash.toString(CryptoJS.enc.Hex),
        accs,
        names).send({ from: await selectedAddress(), value: 1 });

  } catch (error) {
    console.log("transaction failed\n");
    alert("Trasaction failed, reason: " + getReason(error));
  }
  verifyContract();
}

const ckSign = document.getElementById("ck-sign");
ckSign.onclick = async () => {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install Metamask and reload page");
    return;
  }

  let web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId();

  const contractKeeper = new web3.eth.Contract
    (ckjson.abi, ckjson.networks[networkId].address);



  if (typeof ckjson.networks[networkId] === 'undefined') {
    alert("ContratKepper not deployed on Netword Id " + networkId);
    return;
  }
  document.getElementById("message-area").innerHTML = "PROCESSING PLEASE WAIT";
  console.log("PROCCESSING");
  try {
    const response = await contractKeeper.methods
      .signContract("0x" + hash.toString(CryptoJS.enc.Hex)).send({ from: await selectedAddress() });
  } catch (error) {
    console.log("transaction failed\n");
    alert("Trasaction failed, reason: " + getReason(error));
  }
  verifyContract();
}