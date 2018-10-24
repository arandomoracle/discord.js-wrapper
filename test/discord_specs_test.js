const Utils = require('./utils');

const { Bot } = require('../index');

exports['discord specs'] = {
  setUp: done => {
    done();
  },
  'empty guild': test => {
    const guildSpec = { purpose: 'Test Guild' };

    const bot = new Bot({
      description: {
        guild: guildSpec
      }
    });

    Utils.setupTestBot(bot);

    test.equal(bot.guilds.length, 1);
    test.equal(bot.guilds[0].instance.name, guildSpec.purpose);
    test.done();
  },
  'guild with channels': test => {
    const guildSpec = {
      purpose: 'Test Guild',
      channels: [
        { purpose: 'Test Channel 1' },
        { purpose: 'Test Channel 2' },
        { purpose: 'Test Channel 3' }
      ]
    };

    const bot = new Bot({
      description: {
        guild: guildSpec
      }
    });

    Utils.setupTestBot(bot);

    test.equal(bot.guilds.length, 1);

    const guild = bot.guilds.get(guildSpec.purpose);
    test.equal(guild.channels.array().length,
      guildSpec.channels.length);

    test.done();
  },
  'two guilds': test => {
    const guildSpecs = [
      { purpose: 'Test Guild 1' },
      { purpose: 'Test Guild 2' }
    ];

    const bot = new Bot({
      description: {
        guilds: guildSpecs
      }
    });

    Utils.setupTestBot(bot);

    test.equal(bot.guilds.length, guildSpecs.length);
    test.done();
  },
  'category with channels': test => {
    const categorySpec = {
      purpose: 'Test Category',
      channels: [
        { purpose: 'Test Channel 1' },
        { purpose: 'Test Channel 2' },
        { purpose: 'Test Channel 3' }
      ]
    };

    const bot = new Bot({
      description: {
        guild: {
          purpose: 'Test Guild',
          categories: [ categorySpec ]
        }
      }
    });

    Utils.setupTestBot(bot);

    const category = bot.guilds[0].categories.get(categorySpec.purpose);
    test.equal(category.channels.array().length,
      categorySpec.channels.length);

    test.done();
  },
  'top level channels and a category': test => {
    const categorySpec = {
      purpose: 'Test Category',
      channels: [
        { purpose: 'Test Channel 4' },
        { purpose: 'Test Channel 5' },
        { purpose: 'Test Channel 6' }
      ]
    };

    const channelSpecs = [
      { purpose: 'Test Channel 1' },
      { purpose: 'Test Channel 2' },
      { purpose: 'Test Channel 3' }
    ];

    const guildSpec = {
      purpose: 'Test Guild',
      categories: [ categorySpec ],
      channels: channelSpecs
    };

    const bot = new Bot({
      description: {
        guild: guildSpec
      }
    });

    Utils.setupTestBot(bot);

    const guild = bot.guilds.get(guildSpec.purpose);
    test.equal(guild.channels.array().length,
      categorySpec.channels.length + channelSpecs.length + 1);

    test.done();
  },
  'multiple categories': test => {
    const categorySpecs = [
      {
        purpose: 'Test Category 1',
        channels: [
          { purpose: 'Test Channel 1' },
          { purpose: 'Test Channel 2' },
          { purpose: 'Test Channel 3' }
        ]
      },
      {
        purpose: 'Test Category 2',
        channels: [
          { purpose: 'Test Channel 4' },
          { purpose: 'Test Channel 5' },
          { purpose: 'Test Channel 6' }
        ]
      }
    ];

    const guildSpec = {
      purpose: 'Test Guild',
      categories: categorySpecs
    };

    const bot = new Bot({
      description: {
        guild: guildSpec
      }
    });

    Utils.setupTestBot(bot);

    const channelCount = categorySpecs.reduce(
      (sum, category) => sum + category.channels.length + 1, 0);

    const guild = bot.guilds.get(guildSpec.purpose);
    test.equal(guild.channels.array().length, channelCount);

    test.done();
  }
};
