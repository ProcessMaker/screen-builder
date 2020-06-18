import { set, get } from 'lodash';

export default {
  props: {
    vdata: {
      type: Object,
      required: true,
    },
  },
  computed: {
    references__() {
      return this.$parent && this.$parent.references__;
    },
  },
  methods: {
    submit() {
      this.$emit('submit', this.vdata);
    },
    getValue(name) {
      get(this, name);
    },
    setValue(name, value) {
      const splittedName = name.split('.');
      const baseName = splittedName[0];
      if (this.vdata[baseName] === undefined) {
        this.$set(this.vdata, baseName, splittedName.length > 1 ? {} : value);
      }
      set(this.vdata, name, value);
    },
  },
};
