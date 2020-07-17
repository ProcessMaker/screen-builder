import { get } from 'lodash';

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
    submitForm() {
      this.$emit('submit', this.vdata);
    },
    getValue(name, object = this) {
      return object ? get(object, name) : undefined;
    },
    setValue(name, value, object = this, defaults = object) {
      if (object) {
        const splittedName = name.split('.');
        splittedName.forEach((attr, index) => {
          this.$set(
            object,
            attr,
            index < splittedName.length - 1 ? get(object, attr) || get(defaults, attr) || {} : value
          );
          object = get(object, attr);
        });
      }
    },
  },
};
