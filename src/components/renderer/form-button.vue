<template>
  <div class="form-group">
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
  methods: {
    setValue(parent, name, value) {
      if (parent.items) {
        this.setValue(parent.$parent, name, value);
      } else {
        this.$vueSet(parent.data, this.getValidPath(name), value);
      }
    },
    click() {
      if (this.event !== 'pageNavigate' && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      this.$emit(this.event, this.eventData);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
