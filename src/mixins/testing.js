import { get } from 'lodash';

// TESTING HELPERS
let mounted;
window.testing = {
  builder: null,
  onready: new Promise(resolve => mounted = resolve),
  addControlByType(type, target = null) {
    const control = this.builder.controls.find(control => control.component === type);
    this.builder.testingAddControl(control, target);
  },
  addControlByLabel(label, target = null) {
    const control = this.builder.controls.find(control => control.label === label);
    this.builder.testingAddControl(control, target);
  },
  removeControl(index) {
    this.builder.testingDeleteItem(index);
  },
  showControlsTypes() {
    const types = this.builder.controls.map(control => control.component);
    // eslint-disable-next-line no-console
    console.log(types);
  },
  showControlsLabels() {
    const labels = this.builder.controls.map(control => control.label);
    // eslint-disable-next-line no-console
    console.log(labels);
  },
};

export default {
  data() {
    window.testing.builder = this;
    return {};
  },
  methods: {
    testingAddControl(control, target) {
      const clone = this.cloneControl(control);
      if (!target) {
        this.config[this.currentPage].items.push(clone);
      } else {
        const items = get(this, target);
        items.push(clone);
      }
      this.updateState();
      this.inspect(clone);
    },
    testingDeleteItem(index) {
      this.config[this.currentPage].items.splice(index, 1);
      this.updateState();
    },
  },
  mounted() {
    this.$nextTick(() => mounted());
  },
};
