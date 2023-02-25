const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const { sendSlackMessage } = require("./api/slack");

dotenv.config();

// TODO: Make websiteUrl configurable in a .config file or .env
const websiteUrl = "https://shopusa.fujifilm-x.com/products/0-74101-20124-6";
const scrapedItem = {
  sku: "",
  productName: "",
  location: websiteUrl,
  price: "",
};

let isAvailable = false;

const run = async () => {
  console.log("Scraping...");
  // Launch a browser
  const browser = await puppeteer.launch();
  // Open a new page
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  // Navigate to website
  await page.goto(websiteUrl);

  // Scrape the given websiteUrl for itemName
  // - returns an array
  const itemName = await page.evaluate(
    () =>
      Array.from(
        (itemName = document.querySelectorAll("h1.pdp-product-title")),
        (e) => e.innerText
      )[0]
  );

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
  const setItemInfo = await itemSkuPrice.map((attribute) => {
    scrapedItem.sku = attribute.sku;
    scrapedItem.productName = itemName;
    scrapedItem.price = attribute.price;
    isAvailable = true;
    console.log(scrapedItem);
  });

  isAvailable
    ? await sendSlackMessage(scrapedItem)
    : console.log("Not in-stock. Retrying...");

  await browser.close();
};

// Initialize app

const init = async () => {
  console.log("Initializing");
  setInterval(run, 10000);
};

init();
