process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled rejection at: Promise ', p, ' reason: ', reason);
});

const { Client } = require('discord.js-tests').Mocks;
const Description = require('../lib/description');

const setupTestBot = bot => {
  bot.client = new Client();

  bot.guilds.forEach(spec => {
    replaceFetch(spec);
    spec.link(bot.client);
  });

  return bot;
};

const replaceFetch = spec => {
  spec.fetch = fetchMock;

  if (Object.keys(spec.fields).length > 0) {
    spec.forEachChild(replaceFetch);
  }
};

function fetchMock(parentInstance) {
  const mock = parentInstance.create(this.constructor.type, this.purpose);
  this.id = mock.id;
  return mock;
}

Description.checkRequiredParams = () => true;

module.exports = {
  setupTestBot: setupTestBot
};
