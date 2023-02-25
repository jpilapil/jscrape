import { WebClient } from "@slack/web-api";
// import { sendSlackMessage } from "../api/slack";

const slackChannel = process.env.SLACK_CHANNEL;
const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

export const sendSlackMessage = async (scrapedItem) => {
  console.log("before the try");
  try {
    console.log("you hit sendSlackMessage");
    await slackClient.chat.postMessage({
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
    });
    console.log("Successfully sent Slack message");
  } catch (e) {
    console.error(`There was an error sending the Slack message`);
  }
};
