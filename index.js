const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const { sendSlackMessage } = require("./api/slack");

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
  // await page.setDefaultNavigationTimeout(0);
  // Navigate to website
  await page
    .goto(websiteUrl, {
      waitUntil: "domcontentloaded",
    })
    .catch((err) => console.log("error loading url", err));

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
    : console.log("Not in-stock. Retrying...");

  await browser.close();
};

// Initialize app

const init = async () => {
  console.log("Initializing");
  setInterval(jscrape, 5000);
};

init();
