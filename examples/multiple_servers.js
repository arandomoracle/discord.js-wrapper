require('dotenv').config();

const { Bot } = require('discordjs-wrapper');

class CustomBot extends Bot {
  constructor(options) {
    super(options);

    this.on('ready', () => {
      const guilds = this.guilds.get('main');
      const guildNames = guilds.map(guild => guild.name);
      console.log(`Connected to ${guildNames.join(', ')}`);
    });
  }
}

const bot = new CustomBot({
  discordToken: process.env.DISCORD_TOKEN,
  description: {
    guilds: [
      {
        purpose: 'main',
        id: 'FIRST_GUILD_ID'
      },
      {
        purpose: 'main',
        id: 'SECOND_GUILD_ID'
      }
    ]
  }
});

bot.login()
  .catch(console.error);
