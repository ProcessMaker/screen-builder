<template>
  <div>

    <div id="addOption" class="card" v-show="showOptionCard">
      <div class="card-header">
        {{ $t('Add Option') }}
      </div>
      <div class="card-body">
        <label for="option-value">{{ $t('Value') }}</label>
        <b-form-input id="option-value" v-model="optionValue"/>
        <label for="option-content">{{ $t('Content') }}</label>
        <b-form-input id="option-content" v-model="optionContent"/>
        <div class="card-footer">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="showOptionCard=false">
            Cancel
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-10">
          <label for="data-sources">{{ $t('Options') }}</label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-sm">
            <draggable @update="updateSort"
              :element="'tbody'"
              v-model="existingOptions"
              :options="{group:'options'}"
              @start="drag=true"
              @end="drag=false"
            >
              <tr v-for="(option, index) in existingOptions" :key="index">
                <td style="width:10%;">
                  <span class="fas fa-arrows-alt-v"/>
                </td>
                <td style="width:10%;">
                  <input type="radio" class="form-check-input2" id="materialChecked" name="materialExampleRadios">
                </td>
                <td style="width:50%;">
                  {{ option.content }}
                </td>
                <td style="width:10%;">
                  <a @click="editOption(index)" class="fas fa-cog"/>
                </td>
                <td style="width:10%;">
                  <a @click="removeOption(index)" class="fas fa-trash-alt"/>
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <a @click="editAsJson()" href="#">
            <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> Edit as JSON</small>
          </a>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-1">
          <input type="checkbox" class="form-check-input" id="materialUnchecked">
        </div>
        <div class="col-11">
          Allow multiple selections
        </div>
      </div>
      <div class="row mb-1">
        <div class="col">
          Render Option As
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
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
      existingOptions: [{'value': 'key1', 'content': 'Val1'}, {'value': 'key2', 'content': 'Val2'}, {'value': 'key3', 'content': 'Val3'}],
      showOptionCard: false,
      optionValue: '',
      optionContent: '',
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
    editOption() {
      this.showOptionCard = true;
    },
    addError() {
    },
    addValue() {
    },
    addContent() {
    },
    updateSort() {
    },
    editAsJson() {
      alert('dummy edit as json');
    },
    showAddOption() {
      this.showOptionCard = true;
    },
    addOption() {
      this.existingOptions.push(
        {
          content: this.optionContent,
          value: this.optionValue,
        }
      );
      this.showOptionCard = false;
    },
    removeOption(index) {
      this.existingOptions.splice(index, 1);
    },
  },
};
</script>
