const algosdk = require("algosdk");

const algotransaction = async () => {
  // replace the values of address, privateKey , addressTO and amount according to your need

  const address = "BW7RXP3M44P7ZRABPOJS4QKTPD2G7WG4GI4ASJN6SOE2LB3CNW52OA73HE";
  const addressTO =
    "NSTH6PYEJQIWNRR6EJE4SW76MGYFWMFHJKQ6ZVKFDG5KIZ2AX5EHN6MFGM";
  const privateKey = new Uint8Array([
    50, 233, 126, 98, 122, 105, 125, 215, 71, 70, 162, 209, 109, 122, 192, 25,
    233, 31, 225, 79, 201, 30, 175, 142, 249, 164, 88, 108, 26, 171, 203, 150,
    13, 191, 27, 191, 108, 231, 31, 252, 196, 1, 123, 147, 46, 65, 83, 120, 244,
    111, 216, 220, 50, 56, 9, 37, 190, 147, 137, 165, 135, 98, 109, 187,
  ]);

  const algodToken = "";
  const algodServer = "http://testnet-api.algonode.cloud";
  const algodPort = undefined;
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  const acctInfo = await algodClient.accountInformation(address).do();
  console.log(`Account balance: ${acctInfo.amount} microAlgos`);

  const suggestedParams = await algodClient.getTransactionParams().do();
  const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: address,
    suggestedParams,
    to: addressTO,
    amount: 10000,
    note: new Uint8Array(Buffer.from("hello world")),
  });

  const signedTxn = ptxn.signTxn(privateKey);

  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("txId: ", txId);
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log(result);
  console.log(`Transaction Information: ${result.txn}`);
  console.log(`Decoded Note: ${Buffer.from(result.txn.txn.note).toString()}`);
};

algotransaction();
