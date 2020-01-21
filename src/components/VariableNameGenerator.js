export default class VariableNameGenerator {
  names = [];

  GetVariableNames(configuration) {
    configuration.forEach(item => {

      //If the element has containers
      if (Array.isArray(item)) {
        this.GetVariableNames(item);
      }

      //If the element has items
      if (item.items) {
        this.GetVariableNames(item.items);
      }

      //If the element has its variable name set
      if (item.config && item.config.name) {
        this.names.push(`${item.config.name}`);
      }

    });

  }

  generate(config, component) {
    this.names = [];
    this.GetVariableNames(config);
    let definitionId = this.generateNameId(this.snakeCase(component), 1);
    this.names.push(definitionId);

    return [this.names, definitionId];
  }

  snakeCase(name) {
    return name.replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  }

  generateNameId = (name, id) => {
    let generated = name + '_' + id;
    if (this.names.indexOf(generated) !== -1) {
      id++;
      generated = this.generateNameId(name, id);
    }
    return generated;
  };

}
