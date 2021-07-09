<template>
  <div>
    <label class="typo__label">{{ label }}</label>
    <multiselect
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      :placeholder="$t('Select...')"
      :show-labels="false"
      :options="options.map(option => option.value)"
      :class="classList"
      :custom-label="getLabelFromValue"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import ValidationMixin from '@processmaker/vue-form-elements/src/components/mixins/validation';

export default {
  inheritAttrs: false,
  mixins: [ValidationMixin],
  props: [
    'label',
    'error',
    'options',
    'helper',
    'name',
    'value',
    'selectedControl',
  ],
  computed: {
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
      };
    },
  },
  methods: {
    getLabelFromValue(value) {
      const selectedOption = this.options.find(option => option.value == value);
      return selectedOption ? selectedOption.content : null;
    },
  },
};
</script>

<style lang="scss">
  .is-invalid .multiselect__tags {
    border-color: red !important;
  }
</style>
