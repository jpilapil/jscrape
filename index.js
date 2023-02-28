const { jscrape } = require("./scraper/jscrape");

console.log("Initializing n.n");

// Initialize app
jscrape();

// Run jscrape when file is executed, and then in an interval
const interval = setInterval(jscrape, 0.1 * 60 * 1000); // 1 sec = 1000

// Stop the interval when program is killed
process.on("SIGINT", () => {
  console.log("\nStopping program...");
  clearInterval(interval);
  process.exit();
});
