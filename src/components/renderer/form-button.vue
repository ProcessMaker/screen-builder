<template>
  <div class="form-group"  style="overflow-x: hidden">
    <button @click="click" :class="classList" :name="name">{{ label }}</button>
  </div>
</template>

<script>
import { getValidPath } from '@/mixins';

export default {
  mixins: [getValidPath],
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue'],
  computed: {
    classList() {
      let variant = this.variant || 'primary';
      return {
        btn: true,
        ['btn-' + variant]: true,
      };
    },
  },
  data() {
    return {
    };
  },
  methods: {
    setValue(parent, name, value) {
      if (parent) {
        if (parent.items) {
          this.setValue(parent.$parent, name, value);
        } else {
          this.setValue(parent.data, this.getValidPath(name), value);
        }
      }
    },
    click() {
      if (this.event === 'script') {
        this.$emit('input', this.fieldValue);
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event !== 'pageNavigate' && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      this.$emit(this.event, this.eventData);
      if (this.event === 'pageNavigate') {
        this.$emit('page-navigate', this.eventData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
