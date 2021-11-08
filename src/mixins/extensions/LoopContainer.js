import LoopControl from '../../mixins/LoopControl';

export default {
  props: {
    configRef: null,
    loopContext: null,
  },
  data() {
    return {
      loops: [],
    };
  },
  methods: {
    loadFormLoopProperties({ properties, element }) {
      this.registerVariable(element.config.settings.varname, {});
      this.loops.push({ variable: element.config.settings.varname, element, properties });
    },
    loadFormLoopItems({ element, node, definition }) {
      const loop = this.createComponent('div', {
        'v-for': `(loopRow, index) in ${element.config.settings.varname}`,
      });
      const nested = {
        config: [
          {
            items: element.items,
          },
        ],
        watchers: definition.watchers,
      };

      let loopContext = '';
      if (this.loopContext) {
        loopContext = this.loopContext + '.';
      }
      loopContext += element.config.settings.varname;

      // Add nested component inside loop
      const child = this.createComponent('ScreenRenderer', {
        ':definition': this.byValue(nested),
        ':value': 'loopRow',
        ':loop-context': `'${loopContext}.' + index`,
        ':_parent': 'getValidationData()',
        ':components': this.byRef(this.components),
        ':config-ref': this.byRef(this.configRef || definition.config),
        '@submit': 'submitForm',
      });
      const addLoopRow = this.createComponent('AddLoopRow', {
        ':value': element.config.settings.varname,
        ':config': this.byValue(element.config),
      });
      loop.appendChild(child);
      node.appendChild(loop);
      node.appendChild(addLoopRow);
      // Register nested component as Array
      this.registerNestedVariable(
        element.config.settings.varname,
        element.config.settings.varname + '.index.',
        nested
      );
    },
  },
  mounted() {
    this.alias['FormLoop'] = 'div';
    this.extensions.push({
      beforeload() {
        this.loops.splice(0);
      },
      onloadproperties(params) {
        if (params.element.container && params.componentName === 'FormLoop') {
          this.loadFormLoopProperties(params);
        }
      },
      onloaditems(params) {
        if (params.element.container && params.componentName === 'FormLoop') {
          this.loadFormLoopItems(params);
        }
      },
      onbuild({ screen }) {
        screen.mixins.push(LoopControl);
        this.loops.forEach(({variable, element}) => {
          this.addMounted(screen, `this.initLoopVariable(${JSON.stringify(variable)}, ${JSON.stringify(element.config)});`);
        });
      },
    });
  },
};
