<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>

    <select
      v-bind="$attrs"
      v-uni-id="name"
      class="form-control"
      :class="classList"
      :name='name'
      @change="$emit('input', $event.target.value)"
    >
      <option :value="null">{{placeholder ? placeholder : $t('Select')}}</option>
      <option
        v-for="(option, index) in selectOptions"
        :selected="option.value == valueOrDefault"
        :value="option.value"
        :key="index"
      >
        {{option.content}}
      </option>
    </select>
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import ValidationMixin from '../mixins/validation'
import { createUniqIdsMixin } from 'vue-uniq-ids'
import DataFormatMixin from '../mixins/DataFormat';
import hasDefaultOptionKey from '../mixins/hasDefaultOptionKey';
import DisplayErrors from './common/DisplayErrors';

const uniqIdsMixin = createUniqIdsMixin();

function removeInvalidOptions(option) {
  return Object.keys(option).includes('value', 'contemnt') &&
    option.content != null;
}

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin, hasDefaultOptionKey],
  props: [
    'label',
    'error',
    'value',
    'options',
    'helper',
    'name',
    'controlClass',
    'validationData',
    'placeholder',
  ],
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    },
    selectOptions() {
      if (Array.isArray(this.options)) {
        return this.options;
      }

      return this.optionsFromDataSource;
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
  },
}
</script>
