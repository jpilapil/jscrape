const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const { sendSlackMessage } = require("../api/slack");
dotenv.config();

const itemUrl = process.env.ITEM_URL;

// TODO: Make websiteUrl configurable in a .config file or .env
const websiteUrl = itemUrl;
const scrapedItem = {
  // sku: "",
  // productName: "",
  location: websiteUrl,
  // price: "",
};
let isAvailable = false;

const jscrape = async () => {
  // TODO: Create feature that allows multiple browsers to scrape different URLS - Could this be one with tab instead?

  console.log("Scraping...");
  // Launch a browser
  const browser = await puppeteer.launch();
  // Open a new page
  const page = await browser.newPage();
  // Set a longer timeout value for page navigation
  await page.setDefaultNavigationTimeout(30000);

  let isNavigationSuccessful = false;
  while (!isNavigationSuccessful) {
    try {
      // Navigate to website
      await page.goto(websiteUrl, {
        waitUntil: "domcontentloaded",
      });
      isNavigationSuccessful = true;
    } catch (err) {
      // If a TimeoutError occurs, wait for 5 seconds and try again
      if (err.name === "TimeoutError") {
        console.log("Navigation timeout occurred. Retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        // If the error is not a TimeoutError, log it and exit the function
        console.log("Error occurred while navigating to website:", err);
        await browser.close();
        return;
      }
    }
  }

  // Scrape the given websiteUrl for itemName
  const itemName = await page.evaluate(() => {
    const itemNameElement = document.querySelector("h1.pdp-product-title");
    return itemNameElement ? itemNameElement.innerText : null;
  });

  // Scrape the given websiteUrl for item info (sku, price)
  const itemSkuPrice = await page.$$eval(
    ".pdp-buy-now-sect [data-price]",
    (attributes) =>
      attributes.map((e) => ({
        sku: e.getAttribute("data-sku"),
        price: e.getAttribute("data-price"),
      }))
  );

  // Populate scrapedItem with data scraped from the websiteUrl
  await Promise.all(
    itemSkuPrice.map(async (attribute) => {
      scrapedItem.sku = attribute.sku;
      scrapedItem.productName = itemName;
      scrapedItem.price = attribute.price;
      isAvailable = true;
      console.log(scrapedItem);
    })
  );

  isAvailable
    ? await sendSlackMessage(scrapedItem)
    : console.log("Not in-stock");

  await browser.close();
};

module.exports = { jscrape };
