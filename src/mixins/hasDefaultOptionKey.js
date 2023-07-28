export default {
  computed: {
    valueOrDefault() {
      return this.value || this.options.defaultOptionKey;
    },
  },
  watch: {
    'options.defaultOptionKey': {
      immediate: true,
      handler(value) {
        !this.value ? this.$emit('input', value) : null;
      }
    },
    value: {
      immediate: true,
      handler() {
        !this.value && this.options.defaultOptionKey ? this.$emit('input', this.options.defaultOptionKey) : null;
      }
    },
  },
}
