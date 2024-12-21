const dotenv = require("dotenv");

const {
  Client,
  IntentsBitField,
  GatewayIntentBits,
  messageLink,
} = require("discord.js");

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let currGame;
const gameObj = {};
const errors = [];

client.on("ready", async (c) => {
  console.log("im ready to roll baby");
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) {
    return;
  }
  const content = msg.content;
  try {
    if (content.startsWith("!start")) {
      if (currGame) {
        throw new Error("Game already in progress");
      }
      msg.reply('Please use "!add [route name] [pokemon_name]!"');
      currGame = await msg.reply(" - asdasd");
    } else if (currGame && content.startsWith("!add")) {
      if (content.split(" ").length < 3) {
        throw new Error('Please use "!add [route name] [pokemon_name]!"');
      }

      const contentArray = content.split(" ");
      contentArray.shift();
      pokemon = contentArray.pop().split("_").join(" ");
      const route = contentArray.join(" ");

      if (gameObj[route]) {
        throw new Error(`Route "${route}" has already been used.`);
      }

      gameObj[route] = pokemon;
      currGame.edit(currGame.content + `\n - ${route}: ${pokemon}`);
      errors.forEach((er) => {
        er.delete();
      });
      await msg.delete();
    }
  } catch (e) {
    errors.push(await msg.reply(e.message));
    errors.push(msg);
  }
});

client.login(process.env.DISCORD_TOKEN);
