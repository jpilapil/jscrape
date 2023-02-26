const dotenv = require("dotenv");
const { WebClient } = require("@slack/web-api");
dotenv.config();

const slackChannel = process.env.SLACK_CHANNEL;
const slackToken = process.env.SLACK_TOKEN;
// Connects to client address
const slackClient = new WebClient(slackToken);

const sendSlackMessage = async (scrapedItem) => {
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
              text: `@here\n*${scrapedItem.productName} is IN STOCK!!!*`,
            },
            fields: [
              {
                type: "mrkdwn",
                text: `*SKU*: ${scrapedItem.sku}`,
              },
              {
                type: "mrkdwn",
                text: `*Website*\n${scrapedItem.location}`,
              },
              {
                type: "mrkdwn",
                text: `*Price*\n${scrapedItem.price}`,
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
