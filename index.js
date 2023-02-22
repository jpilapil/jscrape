const puppeteer = require("puppeteer");
// const fs = require("fs");

// TODO: Make websiteUrl configurable in a .config file
const websiteUrl = "https://shopusa.fujifilm-x.com/products/0-74101-20684-5";
const scrapedItem = {
  name: "",
  location: websiteUrl,
  sku: "",
  price: "",
};

const run = async () => {
  console.log("Running...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(websiteUrl);

  // scrape the given websiteUrl for itemName
  // returns an array
  const itemNameArray = await page.evaluate(() =>
    Array.from(
      (itemName = document.querySelectorAll("h1.pdp-product-title")),
      (e) => e.innerText
    )
  );
  // TODO: Refine how we get and set info for scrapedItem
  const setItemName = (scrapedItem.name = itemNameArray[0]);

  // scrape the given websiteUrl for item info (sku, price)
  const inStockInfo = await page.$$eval(
    ".pdp-buy-now-sect [data-price]",
    (attributes) =>
      attributes.map((e) => ({
        sku: e.getAttribute("data-sku"),
        price: e.getAttribute("data-price"),
      }))
  );

  // populate scrapedItem with data scraped from the websiteUrl
  const setItemInfo = await inStockInfo.map((attribute) => {
    scrapedItem.sku = attribute.sku;
    scrapedItem.price = attribute.price;
  });

  // TODO: Send scrapedItem to Slack insead of logging.
  console.log(scrapedItem);

  await browser.close();
};

return run();
