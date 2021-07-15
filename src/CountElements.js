import DataProvider from './DataProvider';

let globalObject = typeof window === 'undefined'
  ? global
  : window;
class Counter {
  screen = null;
  firstPage = 0;
  constructor(element, options) {
    this.element = element;
    Object.assign(this, options);
  }
  async countItems(allElements) {
    throw 'Abstract method countItems not implemented', allElements;
  }
}

/**
 * Add allElements for a group of fields
 */
class ArrayOfFieldsCounter extends Counter {
  async countItems(allElements) {
    for (const item of this.element) {
      await CountElements(item, { screen: this.screen }).countItems(allElements);
    }
  }
}

/**
 * Add allElements for a screen definition
 */
class ScreenCounter extends Counter {
  async countItems(allElements) {
    for (let i=0, l = this.element.config.length; i < l; i++) {
      const screenallElements = CountElements(this.element.config[i].items, { screen: this.element });
      await screenallElements.countItems(allElements);
    }
  }
}

/**
 * Add allElements for a nested screen
 */
class FormNestedScreenCounter extends Counter {
  async countItems(allElements) {
    allElements.push(this.element);
    const definition = await this.loadScreen(this.element.config.screen);
    if (definition && definition[0] && definition[0].items) {
      await CountElements(definition[0].items, { screen: this.screen }).countItems(allElements);
    }
  }

  async loadScreen(id) {
    try {
      if (!globalObject['nestedScreens']) {
        globalObject['nestedScreens'] = {};
      }
      if (globalObject.nestedScreens['id_' + id]) {
        return globalObject.nestedScreens['id_' + id];
      }
      const response = await DataProvider.getScreen(id);
      globalObject.nestedScreens['id_' + id] = response.data.config;
      return response.data.config;
    } catch (e) {
      return false;
    }
  }

}

/**
 * Add allElements for a loop
 */
class FormLoopCounter extends Counter {
  async countItems(allElements) {
    allElements.push(this.element);
    await CountElements(this.element.items, { screen: this.screen }).countItems(allElements);
  }
}

/**
 * Add allElements for a multicolumn
 */
class FormMultiColumnCounter extends Counter {
  async countItems(allElements) {
    await CountElements(this.element.items, { screen: this.screen }).countItems(allElements);
  }
}

/**
 * Add allElements for a form element
 */
class FormElementCounter extends Counter {
  async countItems(allElements) {
    allElements.push(this.element);
  }
}

function CountElements(element, options) {
  if (element instanceof Array) {
    return new ArrayOfFieldsCounter(element, options);
  }
  if (element.config instanceof Array) {
    return new ScreenCounter(element, options);
  }
  if (element.component === 'FormNestedScreen') {
    return new FormNestedScreenCounter(element, options);
  }
  if (element.component === 'FormMultiColumn') {
    return new FormMultiColumnCounter(element, options);
  }
  if (element.component === 'FormLoop') {
    return new FormLoopCounter(element, options);
  }
  return new FormElementCounter(element, options);
}

export default CountElements;
