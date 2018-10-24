require('dotenv').config();

const { Bot } = require('discordjs-wrapper');

class CustomBot extends Bot {
  constructor(options) {
    super(options);

    this.on('ready', () => {
      console.log('Connected to Discord');
    });
  }
}

const bot = new CustomBot({
  discordToken: process.env.DISCORD_TOKEN
});

bot.login()
  .catch(console.error);
