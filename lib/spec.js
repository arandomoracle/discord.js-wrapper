class Spec {
  constructor(purpose, id, fields) {
    this.purpose = purpose;
    this.id = id;
    this.fields = {};

    if (fields) {
      Object.keys(fields).forEach(field => {
        this.addField(field, fields[field]);
      });
    }
  }

  addField(fieldType, field) {
    this.fields[fieldType] = field;
    field.forEach(child => child.parent = this);

    Object.defineProperty(this, fieldType, {
      get: () => this.fields[fieldType]
    });

    field.get = purpose => {
      const children = field.filter(child => child.purpose == purpose);
      if (children.length == 1) {
        return children[0].instance;
      } else if (children.length > 0) {
        return children.map(child => child.instance);
      }
    };

    field.getSpec = id => {
      const specs = field.filter(child => child.id == id);
      if (specs.length == 1) {
        return specs[0];
      } else {
        throw new Error('Duplicate spec id');
      }
    };
  }

  link(parent) {
    parent = this.parent || parent;
    let parentInstance = (parent instanceof Spec) ? parent.instance : parent;
    this.instance = this.fetch(parentInstance);
    this.forEachChild(child => child.link(parent));
    return this.instance;
  }

  fetch(parentInstance) {
    const property = `${this.constructor.type.toLowerCase()}s`;
    return parentInstance[property].get(this.id);
  }

  forEachChild(fn) {
    Object.keys(this.fields).forEach(field => {
      const children = this.fields[field];
      children.forEach(fn);
    });
  }
}

Spec.create = name => {
  const specClass = class extends Spec {};
  specClass.type = name;
  return specClass;
};

module.exports = Spec;
