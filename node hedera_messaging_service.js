const { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery } = require("@hashgraph/sdk");

// Setup Hedera Client
const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

// Create a Topic
async function createTopic() {
    const topicCreateTx = new TopicCreateTransaction().execute(client);
    const topicCreateRx = await topicCreateTx.getReceipt(client);
    const topicId = topicCreateRx.topicId;
    console.log(`Topic Created: ${topicId}`);

    return topicId;
}

// Send Messages
async function sendMessage(topicId, message) {
    const messageSubmitTx = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .execute(client);

    await messageSubmitTx.getReceipt(client);
    console.log(`Message Sent: ${message}`);
}

// Subscribe to Messages
function subscribeToMessages(topicId) {
    new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(client, null, (message) => {
            const messageStr = Buffer.from(message.contents, "utf8").toString();
            console.log(`Message Received: ${messageStr}`);
        });
}

// Main Function
async function main() {
    const topicId = await createTopic();
    await sendMessage(topicId, "Hello, Hedera!");
    subscribeToMessages(topicId);
}

main();
