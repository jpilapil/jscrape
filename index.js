const dotenv = require("dotenv");
const puppeteer = require("puppeteer");
const { sendSlackMessage } = require("./api/slack");

dotenv.config();

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
    await sendSlackMessage(scrapedItem);
  }

  await browser.close();
};

// initialize app

const init = async () => {
  console.log("Initializing");
  return setInterval(run, 10000);
};

init();
