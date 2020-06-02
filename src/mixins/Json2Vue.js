import extensions from '../extensions';

export default {
  mixins: extensions,
  props: {
    value: Object,
    definition: Object,
  },
  data() {
    return {
      extensions: { dataFields: true, computedFields: true },
      nodeNameProperty: 'component',
      variables: [],
      ownerDocument: window.document,
    };
  },
  computed: {
    component() {
      const component = this.componentDefinition();
      const Vue = this.$root.constructor;
      const warnHandler = Vue.config.warnHandler;
      const errorHandler = Vue.config.errorHandler;
      try {
        const errors = [];
        Vue.config.warnHandler = err => {
          errors.push(err);
        };
        Vue.config.errorHandler = err => {
          errors.push(err);
        };
        const VueComponent = Vue.component('json2vue', component);
        const instance = new VueComponent({
          propsData: {
          },
        });
        instance.$mount();
        if (errors.length > 0) {
          throw errors.join('\n');
        }
        Vue.config.warnHandler = warnHandler;
        Vue.config.errorHandler = errorHandler;
        return VueComponent;
      } catch (e) {
        Vue.config.warnHandler = warnHandler;
        Vue.config.errorHandler = errorHandler;
        throw e;
      }
    },
  },
  methods: {
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
        const properties = { ...element.config };
        if (element.container) {
          element;
        } else {
          //properties.class="elementCssClass(element)";
          properties.validationData = 'value';
          this.variables.push({ name: element.config.name, value: '' });
          properties['v-model'] = `${element.config.name}`;
          properties['ancestor-screens'] = '$parent.ancestorScreens';
          properties.name = element.config.name !== undefined ? element.config.name : null;
          properties.disabled = element.config.interactive || element.config.disabled;
          properties.formConfig = '$parent.definition.config';
          // events
          //properties.input="dataChanged";
          //properties.submit="submit";
          //properties.pageNavigate = '$parent.pageNavigate';
        }
        const node = this.createComponent(element[this.nodeNameProperty], properties);
        component.appendChild(node);
      });
    },
    componentDefinition() {
      try {
        const template = this.parse();
        const component = {
          components: {},
          props: {},
          computed: {},
          methods: {},
          watch: {},
          data: () => ({}),
          template,
        };
        // Extensions
        for (let ext in this.extensions) {
          this[ext](component, this);
        }
        return component;
      } catch (e) {
        return {
          template: '<h4 class="text-danger">' + e + '</h4>',
        };
      }
    },
  },
};
