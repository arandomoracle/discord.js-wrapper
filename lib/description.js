const fs = require('fs');
const createSpec = require('./specs');

const structures = {
  guilds: {
    categories: {
      channels: null
    },
    channels: null,
    roles: null,
    emoji: null
  }
};

const types = {
  guilds: 'guild',
  categories: 'category',
  channels: 'channel',
  roles: 'role',
  emoji: 'emoji'
};

class Description {
  constructor(options = {}) {
    this.options = options;

    if (this.options.file) {
      this.options.json = fs.readFileSync(this.options.file);
    }

    if (this.options.json) {
      this.description = JSON.parse(this.options.json);
    }

    if (this.options.object) {
      this.description = this.options.object;
    }
  }

  toSpecs() {
    if (!this.description) {
      return [];
    }

    if (this.description.guild) {
      this.description.guilds = [this.description.guild];
      delete this.description.guild;
    }

    if (this.description.guilds) {
      return this.description.guilds.map(
        guild => Description.read('guilds', guild));
    }

    throw new Error('Invalid description format: ' +
                    'top level entity must be either ' +
                    '\'guild\' or \'guilds\'');
  }
}

Description.checkRequiredParams = (pluralType, entity) => {
  if (!entity.id || !entity.purpose) {
    throw new Error(`Invalid description format: ${pluralType} ` +
                    'must have both an \'id\'  and a \'purpose\'');
  }
};

Description.read = (pluralType, entity, parentStructure = structures) => {
  Description.checkRequiredParams(pluralType, entity);

  const fields = {};

  if (parentStructure[pluralType]) {
    Object.keys(parentStructure[pluralType]).forEach(pluralPartType => {
      if (entity[pluralPartType]) {
        fields[pluralPartType] = entity[pluralPartType].map(
          part => Description.read(
            pluralPartType, part, parentStructure[pluralType]));
      }
    });
  }

  return createSpec(types[pluralType], entity.purpose, entity.id, fields);
};

module.exports = Description;
