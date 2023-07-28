<template>
  <div class="form-group">
    <div :class="divClass">
      <input
        v-bind="$attrs"
        v-uni-id="name"
        type="checkbox"
        :class="classList"
        :name="name"
        :checked="isChecked"
        @change="$emit('change', $event.target.checked)"
      >
      <required-asterisk />
      <label :class="labelClass" v-uni-for="name">{{label}}</label>
      <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
        <div v-for="(error, index) in validatorErrors" :key="index">{{error}}</div>
        <div v-if="error">{{error}}</div>
      </div>

      <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
  </div>
</template>

<script>
import ValidationMixin from '../mixins/validation'
import {createUniqIdsMixin} from 'vue-uniq-ids'
import DataFormatMixin from '../mixins/DataFormat';
import RequiredAsterisk from './common/RequiredAsterisk';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  name: 'FormCheckbox',
  components: {
    RequiredAsterisk,
  },
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: [
    'error',
    'label',
    'name',
    'helper',
    'controlClass',
    'toggle',
    'checked',
    'initiallyChecked',
  ],
  computed: {
    validatorErrors() {
      return this.validator && this.validator.errors.get(this.name) || [];
    },
    isChecked() {
      // if control's value is not set, use the initiallyChecked configuration
      let initCheck = (new Boolean(this.initiallyChecked)) == true;
      if (typeof(this.checked) == 'undefined' || this.checked == null) {
        this.$emit('change', initCheck);
        return initCheck;
      }
      return this.checked;
    },
    divClass() {
      return !this.toggle ? 'form-check' : 'custom-control custom-switch';
    },
    labelClass() {
      return !this.toggle ? 'form-check-label' : 'custom-control-label';
    },
    classList() {
      return [
        this.toggle ? 'custom-control-input' : 'form-check-input',
        {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
          [this.controlClass]: !!this.controlClass,
        }
      ]
    }
  },
}
</script>
