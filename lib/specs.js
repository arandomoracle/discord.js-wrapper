const Spec = require('./spec');

const specTypes = {};

specTypes.add = type => {
  specTypes[type] = Spec.create(type);
};

specTypes.add('guild');
specTypes.add('category');
specTypes.add('channel');
specTypes.add('role');
specTypes.add('emoji');

specTypes['category'].prototype.fetch = function (parentInstance) {
  return parentInstance.channels.get(this.id);
};

module.exports = (type, ...args) => {
  const specType = specTypes[type];
  return new specType(...args);
};
