<template>
  <div>
    <label for="data-sources">{{ $t('Source Type') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources"/>
    <small class="form-text text-muted mb-3">Data source to populate select</small>

    <div v-if="dataSource === dataSourceValues.provideData">
      <label for="json-data">{{ $t('JSON Data') }}</label>
      <b-form-textarea class="mb-3" id="json-data" rows="8" v-model="jsonData"/>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="data-name">{{ $t('Data Name') }}</label>
      <b-form-input id="data-name" v-model="dataName"/>
      <small class="form-text text-muted mb-3">Data source to populate select</small>
    </div>

    <label for="key">{{ $t('Key') }}</label>
    <b-form-input id="key" v-model="key"/>
    <small class="form-text text-muted mb-3">Field to save to the data object</small>

    <label for="value">{{ $t('Value') }}</label>
    <b-form-input id="value" v-model="value"/>
    <small class="form-text text-muted mb-3">Field to show in the select box</small>

    <label for="pmql-query">{{ $t('PMQL') }}</label>
    <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
    <small class="form-text text-muted">Advanced data search</small>
  </div>
</template>

<script>
import { dataSources, dataSourceValues } from './data-source-types';

export default {
  props: ['options'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    return {
      dataSourceValues,
      dataSources,
      dataSource: dataSourceValues.provideData,
      jsonData: '',
      key: null,
      value: null,
      dataName: '',
      pmqlQuery: '',
    };
  },
  watch: {
    dataSource() {
      this.jsonData = '';
      this.dataName = '';
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  computed: {
    dataObjectOptions() {
      return {
        dataSource: this.dataSource,
        jsonData: this.jsonData,
        dataName: this.dataName,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
      };
    },
  },
  mounted() {
    this.dataSource = this.options.dataSource;
    this.jsonData = this.options.jsonData;
    this.dataName = this.options.dataName;
    this.key = this.options.key;
    this.value = this.options.value;
    this.pmqlQuery = this.options.pmqlQuery;
  },
};
</script>
