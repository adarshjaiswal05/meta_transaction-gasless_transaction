const { Web3 } = require("web3");
const ABI = require("./contractDetails").testABI;
const tokenContractAddress = require("./contractDetails").testAddress;

const privateKey = "cf3f0b0c09bbe2bedd83ab91ed4636004e1121e37f46";
const ALCHEMY_API_KEY = "lfUyImkmlrl-MzmmkfvbyuhDeGHfG_9";

async function sendGaslessTransaction() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    )
  );

  // please update the senderAddress, recipientAddress and amount  (pass through function parameter)
  const senderAddress = "0x03761FcaaCdf1bfB00bjkm128608599B"; // it should same as the private key address
  const recipientAddress = "0xAb8483F64d9C6d1E849Ae677dD3315835cb2";
  const amountToSend = "100";

  const tokenContract = new web3.eth.Contract(ABI, tokenContractAddress);

  const data = await tokenContract.methods
    .transfer(recipientAddress, amountToSend)
    .encodeABI();

  const nonce = await web3.eth.getTransactionCount(senderAddress);

  const txObject = {
    to: tokenContractAddress,
    data: data,
    gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    gasLimit: web3.utils.toHex(300000),
    nonce: web3.utils.toHex(nonce),
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    txObject,
    privateKey
  );

  try {
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log("Transaction Receipt:", receipt);
    console.log("Transaction Hash:", receipt.transactionHash);
  } catch (err) {
    console.error("Error sending transaction:", err);
  }
}

// sendGaslessTransaction();
