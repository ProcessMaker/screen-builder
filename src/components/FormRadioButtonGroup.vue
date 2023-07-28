<template>
  <div class="form-group">
    <label>{{label}}</label>

    <div :class="divClass" :key="option.value" v-for="option in radioOptions">
      <input
        v-bind="$attrs"
        type="radio"
        :class="inputClass"
        :value="option.value"
        v-uni-id="`${name}-${option.value}`"
        :checked="option.value == valueOrDefault"
        @change="$emit('input', $event.target.value)"
      >
      <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids'
import DataFormatMixin from '../mixins/DataFormat';
import hasDefaultOptionKey from '../mixins/hasDefaultOptionKey';

const uniqIdsMixin = createUniqIdsMixin();

function removeInvalidOptions(option) {
  return Object.keys(option).includes('value', 'contemnt') &&
    option.content != null;
}

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, DataFormatMixin, hasDefaultOptionKey],
  props: [
    'name',
    'label',
    'error',
    'value',
    'options',
    'helper',
    'controlClass',
    'toggle',
    'validationData'
  ],
  computed: {
    radioOptions() {
      if (Array.isArray(this.options)) {
        return this.options;
      } else {
        return this.optionsFromDataSource;
      }
    },
    optionsFromDataSource() {
      const { jsonData, key, value, dataName } = this.options;
      let options = [];

      const convertToSelectOptions = option => ({
        value: option[key || 'value'],
        content: option[value || 'content'],
      })

      if (jsonData) {
        try {
          options = JSON.parse(jsonData)
            .map(convertToSelectOptions)
            .filter(removeInvalidOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      if (dataName) {
        try {
          options = Object.values(this.validationData[dataName])
            .map(convertToSelectOptions)
            .filter(removeInvalidOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      return options;
    },
    divClass() {
      return this.toggle ? 'custom-control custom-radio' : 'form-check';
    },
    labelClass() {
      return this.toggle ? 'custom-control-label': 'form-check-label';
    },
    inputClass() {
      return [
        { [this.controlClass]: !!this.controlClass },
        { 'is-invalid': (this.validator && this.validator.errorCount) || this.error },
        this.toggle ? 'custom-control-input' : 'form-check-input'
      ];
    }
  }
}
</script>
