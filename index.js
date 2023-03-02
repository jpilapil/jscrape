const { jscrape } = require("./scraper/jscrape");

console.log("Initializing n.n");

// Initialize app
jscrape();

// Run jscrape when file is executed, and then in an interval
const interval = setInterval(jscrape, 5 * 60 * 1000); // 1 sec = 1000

// Stop the interval when program is killed
process.on("SIGINT", () => {
  console.log("\n\nStopping program...\n");
  clearInterval(interval);
  process.exit();
});
