var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
var sourceKeys = StellarSdk.Keypair.fromSecret(
  "SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4"
);
var destinationId = "GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5";
var transaction;

// First, check to make sure that the destination account exists.
server
  .loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("The destination account does not exist!");
    } else return error;
  })
  // If there was no error, load up-to-date information on your account.
  .then(function () {
    return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function (sourceAccount) {
    // Start building the transaction.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          // Because Stellar allows transaction in many currencies, you must
          // specify the asset type. The special "native" asset represents Lumens.
          asset: StellarSdk.Asset.native(),
          amount: "10",
        })
      )
      // A memo allows you to add your own metadata to a transaction.
      .addMemo(StellarSdk.Memo.text("Test Transaction"))
      .setTimeout(180)
      .build();
    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Success! Results:", result);
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
  });
