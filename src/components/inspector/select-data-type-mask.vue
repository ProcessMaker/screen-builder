<template>
  <div v-show="isVisible">
    <label class="typo__label">{{ maskLabel }}</label>
    <multiselect
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      :placeholder="$t('Select...')"
      :show-labels="false"
      :options="maskOptions"
      :label="maskOptionsLabel"
      :class="classList"
    >
      <template slot="noResult">{{ $t('No elements found. Consider changing the search query.') }}</template>
      <template slot="noOptions">{{ $t('No Data Available') }}</template>
    </multiselect>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import FormMultiselect from './form-multiselect';
import maskConfig from '../../form-input-mask-config';

export default {
  extends: FormMultiselect,
  computed: {
    isVisible() {
      return this.selectedControl.config.dataFormat === 'currency';
    },
    maskConfig() {
      return maskConfig[this.selectedControl.config.dataFormat] || maskConfig.defaultMask;
    },
    maskLabel() {
      return this.$t(this.maskConfig.label || 'Data Format');
    },
    maskOptions() {
      return this.maskConfig.options;
    },
    maskOptionsLabel() {
      return this.maskConfig.optionsLabel;
    },
  },
};
</script>
