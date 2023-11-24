const xrpl = require("xrpl");

async function main() {
  const PUBLIC_SERVER = "wss://xrplcluster.com/";
  const client = new xrpl.Client(PUBLIC_SERVER);
  console.log("client: ", client);
  await client.connect();

  try {
    // Example credentials  (replace with your own or remove it and directly use the account below)
    const wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9");
    console.log("wallet: ", wallet);
    console.log(wallet.address); // rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH

    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
      TransactionType: "Payment",
      Account: "rGwQRwKCshmqGwHVfYjcw5A6hL4w6LQq2n", // replace with your wallet address
      Amount: xrpl.xrpToDrops("22"),
      Destination: "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH", // replace with your destination address
    });
    const max_ledger = prepared.LastLedgerSequence;
    console.log("Prepared transaction instructions:", prepared);
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP");
    console.log("Transaction expires after ledger:", max_ledger);

    // Sign prepared instructions ------------------------------------------------
    const signed = wallet.sign(prepared);
    console.log("Identifying hash:", signed.hash);
    console.log("Signed blob:", signed.tx_blob);

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob);

    // Check transaction results -------------------------------------------------
    console.log("Transaction result:", tx.result.meta.TransactionResult);
    console.log(
      "Balance changes:",
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
    );

    client.disconnect();
  } catch (error) {
    console.error("Error:", error);
    client.disconnect(); // Make sure to disconnect the client in case of an error as well
  }
}

main();
