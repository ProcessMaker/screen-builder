<template>
  <div>
    <label for="data-sources">{{ $t('Data Source') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources"/>
    <small class="form-text text-muted">Data source to populate select</small>

    <div v-if="dataSource === 'Provide Data'">
      <label for="json-data">{{ $t('JSON Data') }}</label>
      <b-form-textarea id="json-data" rows="8" v-model="jsonData"/>
    </div>

    <div v-if="dataSource === 'Data Object'">
      <label for="data-name">{{ $t('Data Name') }}</label>
      <b-form-input id="data-name" v-model="dataName"/>
      <small class="form-text text-muted">Data source to populate select</small>
    </div>

    <div>
      <label for="key">{{ $t('Key') }}</label>
      <b-form-input id="key" v-model="key"/>
      <small class="form-text text-muted">Field to save to the data object</small>

      <label for="value">{{ $t('Value') }}</label>
      <b-form-input id="value" v-model="value"/>
      <small class="form-text text-muted">Field to show in the select box</small>
    </div>

    <div v-if="dataSource === 'Data Object'">
      <label for="pmql-query">{{ $t('PMQL Query (optional)') }}</label>
      <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
      <small class="form-text text-muted">Advanced data search</small>
    </div>
  </div>
</template>

<script>
export default {
  props: ['options', 'data'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    const dataSources = [
      'Provide Data',
      'Data Object',
    ];

    return {
      dataSources,
      dataSource: dataSources[0],
      jsonData: '',
      key: null,
      value: null,
      dataName: '',
      pmqlQuery: '',
    };
  },
  watch: {
    parsedOptions(parsedOptions) {
      this.$emit('change', parsedOptions);
    },
    options(options) {
      this.jsonData = JSON.stringify(options);
    },
    dataName(dataName) {
      this.jsonData = JSON.stringify(this.data[dataName]);
    },
  },
  computed: {
    inputData() {
      switch (this.dataSource) {
        case 'Provide Data':
          return this.jsonData;

        case 'Data Object':
          return this.data[this.dataName];
      }
    },
    parsedOptions() {
      try {
        return JSON.parse(this.inputData).map(option => ({
          value: option[this.key || 'value'], content: option[this.value || 'content'],
        }));
      } catch (error) {
        return [{ value: null, content: 'Select' }];
      }
    },
  },
};
</script>
