const Discord = require('discord.js');
const Description = require('./description');

class Bot {
  constructor(options) {
    this.options = options;
    this.discordToken = this.options.discordToken;
    this.client = new Discord.Client();

    if (this.options.descriptionFile) {
      this.description = new Description({
        file: this.options.descriptionFile
      });
    }

    if (this.options.descriptionJSON) {
      this.description = new Description({
        json: this.options.descriptionJSON
      });
    }

    if (this.options.description) {
      this.description = new Description({
        object: this.options.description
      });
    }

    if (this.description) {
      this.describe(this.description);
    }
  }

  describe(description) {
    this.guilds = description.toSpecs();

    this.guilds.get = purpose => {
      const children = this.guilds.filter(child => child.purpose == purpose);
      if (children.length == 1) {
        return children[0].instance;
      } else if (children.length > 0) {
        return children.map(child => child.instance);
      }
    };

    this.guilds.getSpec = id => {
      const specs = this.guilds.filter(child => child.id == id);
      if (specs.length == 1) {
        return specs[0];
      } else if (specs.length > 1) {
        throw new Error('Duplicate spec id');
      }
    };
  }

  login() {
    this.client.on('ready', () => {
      if (this.guilds) {
        this.guilds.forEach(guild => guild.link(this.client));
        this.client.emit('guildsLoaded');
      }
    });

    return this.client.login(this.discordToken);
  }

  on(eventName, listener) {
    if (this.guilds && (eventName == 'ready')) {
      eventName = 'guildsLoaded';
    }

    return this.client.on(eventName, listener);
  }
}

module.exports = Bot;
