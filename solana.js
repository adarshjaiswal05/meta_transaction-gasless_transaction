//sendSol.js
const web3 = require("@solana/web3.js");
const connection = new web3.Connection(
  "https://chaotic-green-grass.solana-testnet.discover.quiknode.pro/b6938cd44cba8d4586224578a76bffe89f749633/",
  "confirmed"
);

const secret = [
  168, 5, 206, 219, 136, 13, 183, 150, 11, 142, 82, 210, 102, 79, 170, 233, 150,
  192, 90, 79, 207, 88, 127, 107, 55, 18, 36, 90, 237, 219, 21, 210, 246, 3,
  155, 218, 51, 242, 246, 88, 223, 75, 204, 0, 76, 135, 61, 5, 227, 193, 215,
  243, 178, 13, 192, 159, 105, 116, 90, 206, 59, 98, 107, 73,
];
const from = web3.Keypair.fromSecretKey(new Uint8Array(secret)); // Replace with your secret key
console.log("from: ", from);

// Generate a random address to send to
const to = web3.Keypair.generate();
console.log("to: ", to);

(async () => {
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: web3.LAMPORTS_PER_SOL / 100,
    })
  );
  console.log("transaction: ", transaction);

  // Sign transaction, broadcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  console.log("SIGNATURE", signature);
})();
