const { jscrape } = require("./scraper/jscrape");

console.log("Initializing");

// Initialize app
const interval = async () => {
  setInterval(jscrape, 10 * 60 * 1000); // 1 sec = 1000
};

// run jscrape when file is executed, and then in an interval
jscrape();
interval();
