const dotenv = require("dotenv");
const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

const sendDiscordMessage = (item) => {
  // Create a new client instance
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.once(Events.ClientReady, (c) => {
    // Sets the "Playing status"
    client.user.setActivity(`for ${item.productName}`, {
      type: ActivityType.Watching,
    });
    // Get the channel we want to interact with
    const channel = client.channels.cache.get(channelId);

    channel.send(
      `*@here*\n
      **${item.productName} is in STOCK!!!**\n
      Website: ${item.location}\n
      SKU: ${item.sku}\n
      Price: $${item.price}\n
      \n
      🛑 TO STOP`
    );
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    // Check if the reaction is the stop emoji and the user is not a bot
    if (reaction.emoji.name === "🛑" && !user.bot) {
      console.log("jscrape terminated from Discord.");
      // Log out of Discord and terminate the application
      await client.destroy();
      process.exit();
    }
  });
  // Log in to Discord with your client's token
  client.login(token);
};

module.exports = { sendDiscordMessage };
