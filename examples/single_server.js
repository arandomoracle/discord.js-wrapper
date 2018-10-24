require('dotenv').config();

const { Bot } = require('discordjs-wrapper');

class CustomBot extends Bot {
  constructor(options) {
    super(options);

    this.on('ready', () => {
      const guild = this.guilds.get('main');
      console.log(`Connected to ${guild.name}`);
    });
  }
}

const bot = new CustomBot({
  discordToken: process.env.DISCORD_TOKEN,
  description: {
    guild: {
      purpose: 'main',
      id: 'GUILD_ID'
    }
  }
});

bot.login()
  .catch(console.error);
