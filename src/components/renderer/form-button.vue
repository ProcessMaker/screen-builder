<template>
  <div class="form-group"  style="overflow-x: hidden">
    <button v-b-tooltip="options" @click="click" :class="classList" :name="name" :aria-label="$attrs['aria-label']" :tabindex="$attrs['tabindex']">
      {{ label }}
    </button>
  </div>
</template>

<script>
import Mustache from 'mustache';
import { getValidPath } from '@/mixins';
import { isProxy } from 'is-proxy';

export default {
  mixins: [getValidPath],
  props: ['variant', 'label', 'event', 'eventData', 'name', 'fieldValue', 'value', 'tooltip', 'transientData'],
  watch: {
    '$attrs.validate': {
      deep: true,
      handler(validate) {
        if (validate && !isProxy(validate.vdata.$model)) {
          this.errors = 0;
          let message = '';
          if (validate.$invalid) {
            this.countErrors(validate.vdata);
            this.countErrors(validate.schema);
            message = this.errors === 1
              ? 'There is a validation error in your form.'
              : 'There are {{items}} validation errors in your form.';
            message = this.$t(message, {items: this.errors});
          }
          this.$store.commit('globalErrorsModule/basic', {key: 'valid', value: !validate.$invalid});
          this.$store.commit('globalErrorsModule/basic', {key: 'message', value: message});
        }
      },
    },
  },
  computed: {
    classList() {
      let variant = this.variant || 'primary';
      let isInvalid = this.$store.getters['globalErrorsModule/isValidScreen'] === false;
      return {
        btn: true,
        ['btn-' + variant]: true,
        disabled: this.event === 'submit' && isInvalid,
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
  },
  data() {
    return {
      errors: 0,
    };
  },
  methods: {
    countErrors(obj) {
      if (typeof obj !== 'object') {
        return;
      }
      Object.entries(obj).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object' && '$each' in value) {
            this.countErrors(value.$each);
            return;
          }
          if (typeof value === 'object' && '$invalid' in value && value.$invalid && isNaN(key)) {
            this.errors++;
          }
          if (key !== '$iter' && value) {
            this.countErrors(value);
          }
        }
      });
    },
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
        window.setTimeout(() => {
          this.$emit('input', this.fieldValue);
          this.$nextTick(()=>{
            this.$emit('submit', this.eventData);
          });
        }, 600);
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
