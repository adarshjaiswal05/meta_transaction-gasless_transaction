const { MaticPOSClient } = require("@polygon/maticjs");
const { ethers } = require("ethers");

// Polygon (Matic) configuration
const network = "testnet"; // 'testnet' for Matic Testnet or 'mainnet' for Matic Mainnet
const version = "mumbai"; // 'mumbai' for Matic Testnet or 'v1' for Matic Mainnet
const maticApiUrl = `https://rpc-${network}.${version}.maticvigil.com`;

const parentProviderUrl = "https://rpc-mainnet.maticvigil.com"; // Replace with the mainnet provider URL for Matic Mainnet

// Replace with your own private key and recipient address
const privateKey = "YOUR_PRIVATE_KEY";
const recipientAddress = "RECIPIENT_ADDRESS";

const tokenContractAddress = "TOKEN_CONTRACT_ADDRESS"; // Address of the token contract you want to transfer

async function transferTokens() {
  try {
    // Create a Web3 provider for the Matic network
    const maticProvider = new ethers.providers.JsonRpcProvider(maticApiUrl);

    // Set up the signer using your private key
    const wallet = new ethers.Wallet(privateKey, maticProvider);

    // Connect to Matic POS client
    const maticPOSClient = new MaticPOSClient({
      network,
      version,
      parentProvider: parentProviderUrl,
      maticProvider: maticProvider,
      wallet,
    });

    // Create a transaction to transfer tokens
    const amount = ethers.utils.parseUnits("10", 18); // Amount of tokens to transfer (in this example, 10 tokens)
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      abi,
      wallet
    );
    const transferTx = await tokenContract.transfer(recipientAddress, amount);

    // Wait for the transaction to be confirmed
    await transferTx.wait();

    console.log(
      `Successfully transferred ${amount} tokens to ${recipientAddress}`
    );
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}

transferTokens();
