import extensions from './extensions';
import { set } from 'lodash';

export default {
  mixins: extensions,
  props: {
    value: Object,
    definition: Object,
    components: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      component: null,
      alias: {},
      extensions: [],
      nodeNameProperty: 'component',
      variables: [],
      initialize: [],
      ownerDocument: window.document,
    };
  },
  methods: {
    buildComponent() {
      const component = this.componentDefinition();
      const Vue = this.$root.constructor;
      const warnHandler = Vue.config.warnHandler;
      const errorHandler = Vue.config.errorHandler;
      const errors = [];
      try {
        Vue.config.warnHandler = err => {
          errors.push(err);
        };
        Vue.config.errorHandler = err => {
          errors.push(err);
        };
        const VueComponent = Vue.component('json2vue', component);
        const instance = new VueComponent({
          propsData: {
            vdata: {},
          },
        });
        instance.$mount();
        if (errors.length > 0) {
          throw '';
        }
        return VueComponent;
      } catch (error) {
        return {
          data: () => ({error, errors}),
          template: '<div class="text-danger"><h4>{{ error }}</h4><ul v-for="(error,index) in errors" :key="`error-${index}`"><li>{{ error }}</li></ul></div>',
        };
      } finally {
        Vue.config.warnHandler = warnHandler;
        Vue.config.errorHandler = errorHandler;
      }
    },
    parse() {
      const owner = this.ownerDocument.createElement('div');
      this.loadPages(this.definition.config, owner);
      return '<div>' + owner.innerHTML + '</div>';
    },
    loadPages(pages, owner) {
      this.variables.splice(0);
      pages.forEach(page => {
        const component = this.createComponent('div', {name: page.name, class:'page'});
        this.loadItems(page.items, component);
        owner.appendChild(component);
      });
    },
    snakeCase(name) {
      return name.replace(/[A-Z]/g, m => `-${m}`).toLowerCase().replace(/^-/, '');
    },
    createComponent(nodeName, properties) {
      nodeName = this.snakeCase(nodeName);
      const node = this.ownerDocument.createElement(nodeName);
      for (let property in properties) {
        const value = properties[property];
        if (value !== false && value !== null && value !== undefined) {
          node.setAttribute(this.snakeCase(property), value);
        }
      }
      return node;
    },
    loadItems(items, component) {
      items.forEach(element => {
        const componentName = element[this.nodeNameProperty];
        const nodeName = this.alias[componentName] || componentName;
        const properties = { ...element.config };
        // Extensions.onloadproperties
        this.extensions.forEach((ext) => ext.onloadproperties instanceof Function && ext.onloadproperties.bind(this)({ properties, element, component, items, nodeName, componentName }));
        // Create component
        const node = this.createComponent(nodeName, properties);
        // Extensions.onloaditems to add items to container
        this.extensions.forEach((ext) => ext.onloaditems instanceof Function && ext.onloaditems.bind(this)({ properties, element, component, items, nodeName, componentName, node }));
        // Append node
        component.appendChild(node);
      });
    },
    registerVariable(name, config) {
      const find = this.variables.find(v => v.name === name);
      if (!find) {
        this.variables.push({ name, config });
      }
    },
    elementCssClass(element) {
      const css = [];
      element.config.bgcolor ? css.push(element.config.bgcolor) : null;
      element.config.color ? css.push(element.config.color) : null;
      return css.join(' ');
    },
    componentDefinition() {
      try {
        const template = this.parse();
        // Extensions.onparse
        this.extensions.forEach((ext) => {
          ext.onparse instanceof Function ? ext.onparse.bind(this)(template) : null;
        });
        const component = {
          mixins: [],
          components: this.components,
          props: {
            vdata: {
              type: Object,
              required: true,
            },
          },
          computed: {},
          methods: {
            setValue(name, value) {
              set(this.vdata, name, value);
            },
          },
          watch: {},
          template,
          mounted: [],
        };
        // Extensions.onbuild
        this.extensions.forEach((ext) => {
          ext.onbuild instanceof Function ? ext.onbuild.bind(this)(component) : null;
        });
        Object.keys(component.watch).forEach(key => component.watch[key] = new Function('value', component.watch[key].join("\n")));
        component.mounted = new Function(component.mounted.join("\n"));
        return component;
      } catch (e) {
        return {
          template: '<h4 class="text-danger">' + e + '</h4>',
        };
      }
    },
    addWatch(screen, name, code) {
      if (screen.watch[name]) {
        screen.watch[name].push(code);
      } else {
        screen.watch[name] = [code];
      }
    },
  },
};
