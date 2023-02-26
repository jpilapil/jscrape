const { jscrape } = require("./scraper/jscrape");

console.log("Initializing");

const interval = async () => {
  setInterval(jscrape, 1 * 10 * 1000); // 1 sec = 1000
};

// Run jscrape when file is executed, and then in an interval
jscrape();
interval();
