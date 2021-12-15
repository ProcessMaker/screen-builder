import extensions from './extensions';
import ScreenBase from './ScreenBase';
import CountElements from '../CountElements';
import ValidationsFactory from '../ValidationsFactory';
import _ from 'lodash';

let screenRenderer;

export default {
  mixins: extensions,
  props: {
    value: Object,
    _parent: null,
    definition: Object,
    components: {
      type: Object,
      default() {
        return {};
      },
    },
    showErrors: {
      type: Boolean,
      default: false,
    },
    testScreenDefinition: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      references__: [],
      debugCmp: null,
      component: null,
      alias: {},
      extensions: [],
      nodeNameProperty: 'component',
      variables: [],
      variablesTree: [],
      initialize: [],
      ownerDocument: window.document,
      updatedConfigs: [],
      building: {
        show: false,
        error: '',
        component: '',
        errors: [],
      },
    };
  },
  methods: {
    // Convert foo.0.bar to foo[0].bar
    dot2bracket(str) {
      return str.replace(/\.\d/g, match => `[${match.substr(1)}]`);
    },
    submit() {
      this.$emit('submit', this.value);
    },
    buildComponent(definition) {
      if (window.ProcessMaker && window.ProcessMaker.EventBus) {
        window.ProcessMaker.EventBus.$emit('screen-renderer-build-component', this);
      }
      const component = this.componentDefinition(definition);
      if (!this.testScreenDefinition) {
        return component;
      }
      const Vue = this.$root.constructor;
      const warnHandler = Vue.config.warnHandler;
      const errorHandler = Vue.config.errorHandler;
      const errors = [];
      this.building.error = '';
      this.building.component = '';
      this.building.errors = [];
      this.building.show = false;
      let ScreenRendered;
      try {
        Vue.config.warnHandler = err => {
          errors.push(err);
        };
        Vue.config.errorHandler = err => {
          errors.push(err);
        };
        ScreenRendered = Vue.component('ScreenRendered', component);
        const instance = new ScreenRendered({
          propsData: {
            vdata: {},
          },
        });
        instance.$parent = this;
        instance.$mount();
        if (errors.length > 0) {
          throw this.$t('Building error');
        }
        this.codigo = component;
        return component;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.building.error = error;
        this.building.component = component;
        this.building.errors = errors;
        this.building.show = true;
        return component || {
          template: '<div></div>',
        };
      } finally {
        Vue.config.warnHandler = warnHandler;
        Vue.config.errorHandler = errorHandler;
      }
    },
    parse(screen, definition) {
      const owner = this.ownerDocument.createElement('div');
      this.loadPages(definition, owner, screen);
      return '<div>' + owner.innerHTML + '</div>';
    },
    loadPages(definition, owner, screen) {
      const pages = definition.config;
      this.variables.splice(0);
      // Extensions.beforeload
      this.extensions.forEach((ext) => ext.beforeload instanceof Function && ext.beforeload.bind(this)({ pages, owner, definition }));
      pages.forEach((page, index) => {
        if (page) {
          const component = this.createComponent('div', {name: page.name, class:'page', 'v-if': `currentPage__==${index}`});
          this.loadItems(page.items, component, screen, definition, index);
          owner.appendChild(component);
        }
      });
    },
    escapeVuePropertyName(name) {
      return name.substr(0, 1) === '@' ? name.replace('@', 'v-on:') : this.snakeCase(name);
    },
    snakeCase(name) {
      return name.replace(/[A-Z]/g, m => `-${m}`).toLowerCase().replace(/^-/, '');
    },
    camelCase(name) {
      return name.replace(/_\w/g, m => m.substr(1,1).toUpperCase());
    },
    updateComponentConfig(nodeName, properties) {
      this.updatedConfigs.push({name: nodeName, properties});
    },
    mergeUpdatedConfig(nodeName, properties) {
      let updatedConfig = this.updatedConfigs.find(config => config.name === nodeName);
      if (updatedConfig) {
        let newProperties = updatedConfig.properties;
        for (let property in newProperties) {
          if (properties[property] === undefined) {
            properties[property] = newProperties[property];
          }
        }
      }
      return properties;
    },
    createComponent(nodeName, properties) {
      properties = this.mergeUpdatedConfig(nodeName, this.setDefaultPropertyValues(properties));
      nodeName = this.snakeCase(nodeName);
      const node = this.ownerDocument.createElement(nodeName);
      for (let property in properties) {
        const value = properties[property];
        if (value !== false && value !== null && value !== undefined) {
          if (property.substr(0,1) === ':' || (typeof value === 'string' && value.indexOf('{{') === -1)) {
            node.setAttribute(this.escapeVuePropertyName(property), value);
          } else if (typeof value === 'string' && value.indexOf('{{') !== -1 && !properties.ignoreMustache) {
            node.setAttribute(':' + this.escapeVuePropertyName(property), 'mustache('+this.byValue(value)+')');
          } else if (value !== undefined) {
            node.setAttribute(':' + this.escapeVuePropertyName(property), this.byValue(value));
          }
        }
      }
      return node;
    },
    // convert to json and escape interpolation
    byValue(value) {
      return JSON.stringify(value).replace('{{', '\x7b\x7b').replace('}}', '\x7d\x7d');
    },
    byRef(value) {
      const index = this.references__.indexOf(value) > -1 ? this.references__.indexOf(value) : this.references__.length;
      const reference = `references__[${index}]`;
      this.references__.push(value);
      return reference;
    },
    loadItems(items, component, screen, definition, formIndex) {
      items.forEach(element => {
        const componentName = element[this.nodeNameProperty];
        const nodeName = this.alias[componentName] || componentName;
        const properties = { ...element.config };
        // Extensions.onloadproperties
        this.extensions.forEach((ext) => ext.onloadproperties instanceof Function && ext.onloadproperties.bind(this)({ properties, element, component, items, nodeName, componentName, screen, definition , formIndex}));
        // Create component
        const node = this.createComponent(nodeName, properties);
        // Create wrapper
        const wrapper = this.ownerDocument.createElement('div');
        wrapper.appendChild(node);
        // Extensions.onloaditems to add items to container
        this.extensions.forEach((ext) => ext.onloaditems instanceof Function && ext.onloaditems.bind(this)({ properties, element, component, items, nodeName, componentName, node, wrapper, screen, definition, formIndex}));
        // Append node
        component.appendChild(wrapper);
      });
    },
    setDefaultPropertyValues(props) {
      let result = {...props};
      if (typeof result.ariaLabel === 'undefined' || result.ariaLabel === null || result.ariaLabel === '') {
        if (result.label) {
          result.ariaLabel = result.label;
        }
      }

      if (result.tabindex) {
        result.tabindex = parseInt(result.tabindex);
      }

      return result;
    },
    validVariableName(name) {
      return name && typeof name === 'string' && name.match(/^[a-zA-Z_][0-9a-zA-Z_.]*$/);
    },
    isComputedVariable(name, definition) {
      return definition.computed && definition.computed.find(c => c.property === name);
    },
    registerVariable(name, element = {}) {
      if (!this.validVariableName(name)) {
        return;
      }
      const config = _.get(element, 'config', {});
      const find = this.variables.find(v => v.name === name);
      if (!find) {
        this.variables.push({ name, config, element });
        this.variablesTree.push({ name, config, element });
      }
    },
    registerNestedVariable(name, prefix, definition) {
      const items = screenRenderer.getVariablesTree(definition);
      this.variablesTree.push({ name, prefix, config: {}, items });
      screenRenderer.getVariablesTree({config:[]});
    },
    getVariablesTree(definition) {
      let component;
      try {
        component = {
          mixins: [ScreenBase],
          components: {},
          props: {},
          computed: {},
          methods: {},
          data: {},
          watch: {},
          mounted: [],
        };
        this.variablesTree = [];
        const template = this.parse(component, definition);
        // Extensions.onparse
        this.extensions.forEach((ext) => {
          ext.onparse instanceof Function ? ext.onparse.bind(this)({ screen: component, template, definition}) : null;
        });
        return this.variablesTree;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return this.variablesTree;
      }
    },
    elementCssClass(element) {
      const css = [];
      element.config.bgcolor ? css.push(element.config.bgcolor) : null;
      element.config.color ? css.push(element.config.color) : null;
      return css.join(' ');
    },
    componentDefinition(definition) {
      let component;
      this.building.error = '';
      this.building.component = '';
      this.building.errors = [];
      this.building.show = false;
      try {
        component = {
          //extends: ScreenRendered,
          mixins: [ScreenBase],
          components: {},
          props: {},
          computed: {},
          methods: {},
          data: {},
          watch: {},
          mounted: [],
        };
        const template = this.parse(component, definition);
        // Extensions.onparse
        this.extensions.forEach((ext) => {
          ext.onparse instanceof Function ? ext.onparse.bind(this)({ screen: component, template, definition}) : null;
        });
        component.template = template;
        // Extensions.onbuild
        this.extensions.forEach((ext) => {
          ext.onbuild instanceof Function ? ext.onbuild.bind(this)({ screen: component, definition }) : null;
        });
        // Build data
        component.data = new Function('const data = {};' + Object.keys(component.data).map(key => `this.setValue(${JSON.stringify(key)}, ${component.data[key]}, data);`).join('\n') + 'return data;');
        // Build watchers
        Object.keys(component.watch).forEach((key) => {
          const watch = { deep: true };
          component.watch[key].forEach(w => Object.assign(watch, w.options));
          watch.handler = new Function('value', component.watch[key].map(w => `try{${w.code}}catch(e){console.warn(e)}`).join('\n'));
          component.watch[key] = watch;
        });
        // Add validation rules
        this.addValidationRulesLoader(component, definition);
        // Build mounted
        component.mounted = new Function(component.mounted.join('\n'));
        return component;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.building.error = error;
        this.building.component = component;
        this.building.errors = [];
        this.building.show = true;
        return component || {
          template: '<div></div>',
        };
      }
    },
    addData(screen, name, code) {
      screen.data[name] = code;
    },
    addWatch(screen, name, code, options = {}) {
      if (screen.watch[name]) {
        screen.watch[name].push({code, options});
      } else {
        screen.watch[name] = [{code, options}];
      }
    },
    addMounted(screen, code) {
      screen.mounted.push(code);
    },
    addEvent(properties, event, code) {
      properties[`@${event}`] = code;
    },
    addValidationRulesLoader(component, definition) {
      const firstPage = parseInt(this.currentPage) || 0;
      component.methods.loadValidationRules = function() {
        // Asynchronous loading of validations
        const validations = {};
        ValidationsFactory(definition, { screen: definition, firstPage, data: {_parent: this._parent, ...this.vdata} }).addValidations(validations).then(() => {
          if (_.isEqual(this.ValidationRules__, validations)) {
            return;
          }
          this.ValidationRules__ = validations;
          this.$nextTick(() => {
            if (this.$v) {
              this.$v.$touch();
            }
          });
        });
      };
      component.mounted.push('this.loadValidationRules()');
    },
    countElements(definition) {
      return new Promise(( resolve ) => {
        const allElements = [];
        CountElements(definition, { screen: definition }).countItems(allElements).then(() => {
          resolve(allElements);
        });
      });
    },
  },
  mounted() {
    if (!screenRenderer) {
      screenRenderer = new this.constructor({
        propsData: {
          value: {},
          definition: {config: []},
        },
      });
      screenRenderer.$mount();
    }
  },
};
