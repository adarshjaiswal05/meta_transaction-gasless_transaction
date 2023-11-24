const ethers = require("ethers");
const Avalanche = require("avalanche").Avalanche;
require("dotenv").config();

const privateKey =
  "cf369e5cad95f0b0c09bbe2bedd83ab91ed0bc514636004e1121e37fe44e5a46"; // Private key of the sender replace it with your own

// For sending a signed transaction to the network
const nodeURL = "https://api.avax-test.network/ext/bc/C/rpc";
const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

// For estimating max fee and priority fee using CChain APIs
const chainId = 43113;
const avalanche = new Avalanche(
  "api.avax-test.network",
  undefined,
  "https",
  chainId
);
const cchain = avalanche.CChain();

// For signing an unsigned transaction
const wallet = new ethers.Wallet(privateKey);
const address = wallet.address;
console.log("address: ", address);

// Function to estimate max fee and max priority
const calcFeeData = async (
  maxFeePerGas = undefined,
  maxPriorityFeePerGas = undefined
) => {
  const baseFee = parseInt(await cchain.getBaseFee(), 16) / 1e9;
  maxPriorityFeePerGas =
    maxPriorityFeePerGas == undefined
      ? parseInt(await cchain.getMaxPriorityFeePerGas(), 16) / 1e9
      : maxPriorityFeePerGas;
  maxFeePerGas =
    maxFeePerGas == undefined ? baseFee + maxPriorityFeePerGas : maxFeePerGas;

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw "Error: Max fee per gas cannot be less than max priority fee per gas";
  }

  return {
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
  };
};

// Function to send AVAX
const sendAvax = async (
  amount,
  to,
  maxFeePerGas = undefined,
  maxPriorityFeePerGas = undefined,
  nonce = undefined
) => {
  if (nonce == undefined) {
    nonce = await HTTPSProvider.getTransactionCount(address);
  }

  // If the max fee or max priority fee is not provided, then it will automatically calculate using CChain APIs
  ({ maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(
    maxFeePerGas,
    maxPriorityFeePerGas
  ));

  maxFeePerGas = ethers.utils.parseUnits(maxFeePerGas, "gwei");
  maxPriorityFeePerGas = ethers.utils.parseUnits(maxPriorityFeePerGas, "gwei");

  // Type 2 transaction is for EIP1559
  const tx = {
    type: 2,
    nonce,
    to,
    maxPriorityFeePerGas,
    maxFeePerGas,
    value: ethers.utils.parseEther(amount),
    chainId,
  };

  tx.gasLimit = await HTTPSProvider.estimateGas(tx);

  const signedTx = await wallet.signTransaction(tx);
  console.log("signedTx: ", signedTx);
  const txHash = ethers.utils.keccak256(signedTx);
  console.log("txHash: ", txHash);

  console.log("Sending signed transaction");

  // Sending a signed transaction and waiting for its inclusion
  await (await HTTPSProvider.sendTransaction(signedTx)).wait();

  console.log(
    `View transaction with nonce ${nonce}: https://testnet.snowtrace.io/tx/${txHash}`
  );
};

// setting max fee as 100 and priority fee as 2
sendAvax("0.01", "0x856EA4B78947c3A5CD2256F85B2B147fEBDb7124", 100, 2);
// // reissuing transaction with nonce 25
// sendAvax("0.01", "0x856EA4B78947c3A5CD2256F85B2B147fEBDb7124", 100, 10, 25);

// // cancelling transaction with nonce 25
// sendAvax("0", "0x856EA4B78947c3A5CD2256F85B2B147fEBDb7124", 100, 10, 25);
