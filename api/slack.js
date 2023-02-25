import * as dotenv from "dotenv";
import { WebClient } from "@slack/web-api";

dotenv.config();

const slackChannel = process.env.SLACK_CHANNEL;
const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

export const sendSlackMessage = async () => {
  try {
    // Post a message to the channel, and await the result.
    // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
    // const result = await slackClient.chat.postMessage({
    //   text: "Hello world!",
    //   channel: slackChannel,
    // });
    // call sendSlackMessage function with scrapedItem as argument
    // await sendSlackMessage(scrapedItem);

    await slackClient.chat.postMessage(
      {
        channel: slackChannel,
        text: "@here Your item is in stock!",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `@here ${scrapedItem.productName} is IN STOCK!`,
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
      console.log(`Sent in stock item info to ${slackChannel}`)
    );
  } catch (error) {
    console.log(error);
  }
}();
