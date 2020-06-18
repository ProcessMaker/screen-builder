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
      properties['v-for'] = `loopRow in ${element.config.settings.varname}`;
    },
    loadFormLoopItems({ element, node }) {
      const child = this.createComponent('ScreenRenderer', {
        ':definition': this.byValue({
          config: [
            {
              items: element.items,
            },
          ],
        }),
        ':value': 'loopRow',
        //'components': this.byRef(this.components),
      });
      node.appendChild(child);
    },
  },
  mounted() {
    this.alias['FormLoop'] = 'div';
    this.extensions.push({
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
      onbuild(screen) {
        screen.mixins.push(LoopControl);
        this.loops.forEach(({variable, element}) => {
          this.addMounted(screen, `this.initLoopVariable(${JSON.stringify(variable)}, ${JSON.stringify(element.config)});`);
        });
      },
    });
  },
};
