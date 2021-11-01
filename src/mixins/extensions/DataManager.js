import _ from 'lodash';

export default {
  methods: {
    dataFields(screen, definition) {
      this.variables.filter(v => !this.isComputedVariable(v.name, definition))
        .forEach(v => {
          let component = _.get(v, 'element.component');
          let dataFormat = _.get(v, 'config.dataFormat', null);
          this.addData(screen, v.name, `
            this.getValue(${JSON.stringify(v.name)}, this.vdata) || 
            this.getValue(${JSON.stringify(v.name)}, data) || 
            this.initialValue('${component}', '${dataFormat}')
          `);
          this.addWatch(screen, v.name, `this.setValue(${JSON.stringify(v.name)}, value, this.vdata);this.setValue(${JSON.stringify(v.name)}, value, this.schema);`);
          this.addWatch(screen, `vdata.${v.name}`, `this.setValue(${JSON.stringify(v.name)}, value, this);`);
        });
      screen.props.vdata = null;
    },
  },
  mounted() {
    this.extensions.push({
      onbuild({ screen, definition }) {
        this.dataFields(screen, definition);
      },
    });
  },
};
