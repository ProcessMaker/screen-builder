<template>
  <div>
    <label for="data-sources">{{ $t('Data Source') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources"/>
    <small class="form-text text-muted mb-3">Data source to populate select</small>

    <div v-if="dataSource === 'Provide Data'">
      <label for="json-data">{{ $t('JSON Data') }}</label>
      <b-form-textarea class="mb-3" id="json-data" rows="8" v-model="jsonData"/>
    </div>

    <div v-if="dataSource === 'Data Object'">
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

    <label for="pmql-query">{{ $t('PMQL Query (optional)') }}</label>
    <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
    <small class="form-text text-muted">Advanced data search</small>
  </div>
</template>

<script>
// export const dataSources = [
//   { value: 'provideData', content: 'Provide Data' },
//   { value: 'dataObject', content: 'Data Object' },
// ];

// export const dataSourceValues = dataSources.reduce((values, source) => {
//   values[source.value] = source.value;
//   return values;
// }, {});

export default {
  props: ['options'],
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
    // parsedOptions(parsedOptions) {
    //   this.$emit('change', parsedOptions);
    // },
    dataSource() {
      this.jsonData = '';
      this.dataName = '';
    },
    options(options) {
      console.log('Input options changed!');

      if (Array.isArray(options)) {
        this.jsonData = JSON.stringify(options);
      } else {
        this.jsonData = options.json;
        this.dataName = options.name;
        this.key = options.key;
        this.value = options.value;
        this.pmqlQuery = options.pmqlQuery;
      }
    },
    // dataName(dataName) {
    //   this.jsonData = JSON.stringify(this.data[dataName]);
    // },
    dataObjectOptions(dataObjectOptions) {
      console.log('New options emitted!');
      this.$emit('change', dataObjectOptions);
    },
  },
  computed: {
    inputData() {
      switch (this.dataSource) {
        case 'Provide Data':
          return this.jsonData;

        case 'Data Object':
          return this.dataObjectOptions;
      }
    },
    dataObjectOptions() {
      return {
        json: this.jsonData,
        name: this.dataName,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
      };
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
