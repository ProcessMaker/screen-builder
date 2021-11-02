<template>
  <div class="form-group"  style="overflow-x: hidden">
    <button @click="click" :class="classList" :name="name">{{ label }}</button>
  </div>
</template>

<script>
import { getValidPath } from '@/mixins';

export default {
  mixins: [getValidPath],
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue', 'value'],
  computed: {
    classList() {
      let variant = this.variant || 'primary';
      return {
        btn: true,
        ['btn-' + variant]: true,
      };
    },
    options() {
      if (!this.tooltip || this.event === 'submit') {
        return {};
      }

      let content = '';
      try {
        content = Mustache.render(this.tooltip.content || '', this.transientData);
      } catch (error) { error; }

      return {
        title: content,
        html: true,
        placement: this.tooltip.position || '',
        trigger: 'hover',
        variant: this.tooltip.variant || '',
        boundary: 'window',
      };
    },
    valid() {
      if (this.$attrs.validate) {
        return !this.$attrs.validate.vdata.$invalid && !this.$attrs.validate.schema.$invalid;
      }
      return true;
    },
    message() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.errors = 0;
      if (!this.valid) {
        this.countErrors(this.$attrs.validate.vdata);
        this.countErrors(this.$attrs.validate.schema);
        let message = 'There are {{items}} validation errors in your form.';
        if (this.errors === 1) {
          message = 'There is a validation error in your form.';
        }
        return this.$t(message, {items: this.errors});
      }
      return '';
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
        const trueValue = this.fieldValue || '1';
        const value = (this.value == trueValue) ? null : trueValue;
        this.$emit('input', value);
      }
      if (this.event !== 'pageNavigate' && this.name) {
        this.setValue(this.$parent, this.name, this.fieldValue);
      }
      if (this.event === 'submit') {
        this.$emit('input', this.fieldValue);
        this.$nextTick(()=>{
          this.$emit('submit', this.eventData);
        });
        return;
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
