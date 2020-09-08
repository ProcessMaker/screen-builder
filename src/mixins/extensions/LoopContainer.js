import LoopControl from '../../mixins/LoopControl';

export default {
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
    loadFormLoopItems({ element, node }) {
      const loop = this.createComponent('div', {
        'v-for': `loopRow in ${element.config.settings.varname}`,
      });
      const child = this.createComponent('ScreenRenderer', {
        ':definition': this.byValue({
          config: [
            {
              items: element.items,
            },
          ],
        }),
        ':value': 'loopRow',
        ':components': this.byRef(this.components),
        '@submit': 'submitForm',
      });
      const addLoopRow = this.createComponent('AddLoopRow', {
        ':value': element.config.settings.varname,
        ':config': this.byValue(element.config),
      });
      loop.appendChild(child);
      node.appendChild(loop);
      node.appendChild(addLoopRow);
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
