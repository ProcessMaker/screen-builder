<template>
  <div>
    <label class="typo__label">{{ label }}</label>

    <multiselect
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="$t('Select...')"
      :show-labels="false"
      :options="options.map(option => option.value)"
      :custom-label="getLabelFromValue"
      data-cy="inspector-eventData"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>

export default {
  inheritAttrs: false,
  props: ['label', 'helper', 'formConfig', 'currentPage'],
  methods: {
    getLabelFromValue(value) {
      const selectedOption = this.options.find(option => option.value == value);
      return selectedOption ? selectedOption.content : null;
    },
  },
  computed: {
    options() {
      return Object.keys(this.formConfig)
        .filter(page => page != this.currentPage)
        .map(page => ({ value: page, content: this.formConfig[page].name }));
    },
  },
};
</script>
