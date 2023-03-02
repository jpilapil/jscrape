const dotenv = require("dotenv");
const { Client, Events, GatewayIntentBits } = require("discord.js");
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

const sendDiscordMessage = (item) => {
  // Create a new client instance
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.once(Events.ClientReady, (c) => {
    //  console.log(`Ready! Logged in as ${c.user.tag}`);
    // Get the channel we want to interact with
    const channel = client.channels.cache.get(channelId);

    channel.send(`*@here*\n
      **${item.productName} is in STOCK!!!**\n
      Website: ${item.location}\n
      SKU: ${item.sku}\n
      Price: $${item.price}\n`);
  });
  // Log in to Discord with your client's token
  client.login(token);
};

module.exports = { sendDiscordMessage };
