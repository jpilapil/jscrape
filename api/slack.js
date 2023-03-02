const dotenv = require("dotenv");
const { WebClient } = require("@slack/web-api");
dotenv.config();

const slackChannel = process.env.SLACK_CHANNEL;
const slackToken = process.env.SLACK_TOKEN;
// Connects to client address
const slackClient = new WebClient(slackToken);
const channelName = "jscrape";
const channelId = "C04QTDNUR8V";

// try {
//   // Call the conversations.history method using WebClient
//   const result = await client.conversations.history({
//     channel: channelId
//   });

//   conversationHistory = result.messages;

//   // Print results
//   console.log(conversationHistory.length + " messages found in " + channelId);
// }
// catch (error) {
//   console.error(error);
// }
const sendSlackMessage = async (item) => {
  // await findConversation(slackChannel);
  try {
    await slackClient.chat.postMessage(
      {
        channel: slackChannel,
        text: "@here Your item is in stock!",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `@here\n*${item.productName} is IN STOCK!!!*`,
            },
            fields: [
              {
                type: "mrkdwn",
                text: `*SKU*: ${item.sku}`,
              },
              {
                type: "mrkdwn",
                text: `*Website*\n${item.location}`,
              },
              {
                type: "mrkdwn",
                text: `*Price*\n${item.price}`,
              },
            ],
          },
        ],
      },

      // The result contains an identifier for the message, `ts`.
      console.log(`Item is IN-STOCK!!!\nSent info to ${slackChannel}\n\n`)
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendSlackMessage };
