import puppeteer from "puppeteer";
import fetch from "node-fetch";
import express from "express";

import { WebClient } from "@slack/web-api";
// import { sendSlackMessage } from "../api/slack";

const slackChannel = process.env.SLACK_CHANNEL;
const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

// server
const app = express();
const port = 6969;

app.use(express.json());
app.listen(port, () => {
  console.log(`Running on ${port}`);
});

// TODO: Make websiteUrl configurable in a .config file or .env
const websiteUrl = "https://shopusa.fujifilm-x.com/products/0-74101-20684-5";
const scrapedItem = {
  sku: "",
  productName: "",
  location: websiteUrl,
  price: "",
};

let isAvailable = false;

const run = async () => {
  console.log("Scraping...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(websiteUrl);

  // scrape the given websiteUrl for itemName
  // returns an array
  const itemName = await page.evaluate(
    () =>
      Array.from(
        (itemName = document.querySelectorAll("h1.pdp-product-title")),
        (e) => e.innerText
      )[0]
  );
  // TODO: Refine how we get and set info for scrapedItem
  // const setItemName = (scrapedItem.name = itemName[0]);

  // scrape the given websiteUrl for item info (sku, price)
  const itemSkuPrice = await page.$$eval(
    ".pdp-buy-now-sect [data-price]",
    (attributes) =>
      attributes.map((e) => ({
        sku: e.getAttribute("data-sku"),
        price: e.getAttribute("data-price"),
      }))
  );

  // populate scrapedItem with data scraped from the websiteUrl
  const setItemInfo = await itemSkuPrice.map((attribute) => {
    scrapedItem.sku = attribute.sku;
    scrapedItem.productName = itemName;
    scrapedItem.price = attribute.price;
    isAvailable = true;
    console.log(scrapedItem);
  });

  if (isAvailable) {
    (async () => {
      // Post a message to the channel, and await the result.
      // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
      const result = await slackClient.chat.postMessage({
        text: "Hello world!",
        channel: slackChannel,
      });

      // The result contains an identifier for the message, `ts`.
      console.log(
        `Successfully send message ${result.ts} in conversation ${slackChannel}`
      );
    })();
  }

  // TODO: Create REST API server with express and nodemon
  // !!! Can we simply post to a slack url that is not a webhook? !!!

  // const sendNotification = async (scrapedItem) => {
  //   console.log("api running");
  //   try {
  //     console.log("trying");
  //     // call sendSlackMessage function with scrapedItem as argument
  //     await sendSlackMessage(scrapedItem);
  //     console.log("Successfully sent Slack message");
  //   } catch (err) {
  //     console.error("Unable to send Slack message:", err);
  //   }
  //   return;
  // };

  // app.post("/api/slack.js", sendNotification(scrapedItem));

  // isAvailable
  //   ? console.log("Slack API call here")
  //   : console.log("Not in stock");

  // TODO: Send scrapedItem to Slack insead of logging.

  await browser.close();
};

// initialize app

const init = async () => {
  console.log("Initializing");
  return setInterval(run, 10000);
};

init();
