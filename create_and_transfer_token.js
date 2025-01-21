const { Client, PrivateKey, TokenCreateTransaction, TokenType, TransferTransaction, AccountBalanceQuery } = require("@hashgraph/sdk");

// Setup Hedera Client
const client = Client.forTestnet().setOperator("0.0.5148696", "302e020100300506032b65700422042009123aeecf7b548ca9afb8555c21d8ecc8641a5c287de7590c16541dfc8f1d23");

// Create a Fungible Token
async function createToken() {
    const treasuryKey = PrivateKey.generate();
    const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName("MyToken")
        .setTokenSymbol("MTK")
        .setTreasuryAccountId("0.0.5148696")
        .setInitialSupply(1000)
        .setTokenType(TokenType.FUNGIBLE_COMMON)
        .setTreasuryAccountKey(treasuryKey)
        .freezeWith(client);

    const tokenCreateSign = await tokenCreateTx.sign(treasuryKey);
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateRx.tokenId;
    console.log(`Token Created: ${tokenId}`);

    return tokenId;
}

// Transfer Tokens
async function transferToken(tokenId) {
    const recipientId = "0.0.xxxx"; // Replace with recipient account ID
    const transferTx = new TransferTransaction()
        .addTokenTransfer(tokenId, OPERATOR_ID, -50)
        .addTokenTransfer(tokenId, recipientId, 50)
        .execute(client);

    const transferRx = await transferTx.getReceipt(client);
    console.log("Transfer Successful");
}

// Main Function
async function main() {
    const tokenId = await createToken();
    await transferToken(tokenId);
}

main();
