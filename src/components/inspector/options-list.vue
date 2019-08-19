<template xmlns="http://www.w3.org/1999/html">
  <div>
    <label for="data-sources">{{ $t('Options') }}</label>
    <b-btn v-b-modal.addOptionModal class="fas fa-plus-square"/>
    <table class="table table-sm">
      <draggable @update="updateSort"
        :element="'tbody'"
        v-model="existingOptions"
        :options="{group:'options'}"
        @start="drag=true"
        @end="drag=false"
      >
        <tr v-for="(option, index) in existingOptions" :key="index">
          <td>
            <span class="fas fa-arrows-alt-v"/>
          </td>
          <td>
            <input type="radio" class="form-check-input" id="materialChecked" name="materialExampleRadios" checked>
          </td>
          <td>
            {{ option.content }}
          </td>
          <td>
            <button @click="editOption(index)" class="fas fa-cog"/>
          </td>
          <td>
            <button @click="removeOption(index)" class="fas fa-trash-alt"/>
          </td>
        </tr>
      </draggable>
    </table>
    <div><b>&#x3C;/&#x3E;</b> JSON</div>
    <div><input type="checkbox" class="form-check-input" id="materialUnchecked"> Allow multiple selections</div>
    <div>
      Render Option as
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown button
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>

    <b-modal @cancel="resetAdd" @ok="addOption" id="addOptionModal" title="Add New Option">
      <form-input label="Option Value" v-model="addValue" :error="this.addError"/>
      <form-input label="Option Label" v-model="addContent"/>
    </b-modal>




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
import draggable from 'vuedraggable';
import { dataSources, dataSourceValues } from './data-source-types';

export default {
  components: {
    draggable,
  },
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
      existingOptions: [{'value': 'key1', 'content': 'Val1'}, {'value': 'key2', 'content': 'Val2'}],
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
  updateSort() {
    let newOptions = JSON.parse(JSON.stringify(this.existingOptions));
    this.$emit('change', newOptions);
  },
  methods: {
    resetAdd() {
    },
    addOption() {
    },
    editOption() {
    },
    addError() {
    },
    addValue() {
    },
    addContent() {
    },
    updateSort() {
    },
  },
};
</script>
