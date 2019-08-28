<template>
  <div>
    <label for="data-sources">{{ $t('Data Source') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources" class="mb-3"/>

    <div v-if="!showJsonEditor &&  dataSource === dataSourceValues.provideData">
      <div class="row">
        <div class="col-10">
          <label for="data-sources"><b>{{ $t('Options') }}</b></label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square"/>
        </div>
      </div>

      <div class="card" v-if="showOptionCard">
        <div class="card-header pl-2" v-if="optionCardType == 'insert'">
          {{ $t('Add Option') }}
        </div>
        <div v-else class="card-header">
          {{ $t('Edit Option') }}
        </div>
        <div class="card-body p-2">
          <label for="option-value">{{ $t('Key') }}</label>
          <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />
          <div v-if="optionError" class="invalid-feedback d-block text-right">
            <div>{{ optionError }}</div>
          </div>
          <label class="mt-3" for="option-content">{{ $t('Value') }}</label>
          <b-form-input id="option-content" v-model="optionContent"/>
          <div class="card-footer pr-1 mt-3 text-right">
            <button type="button" class="btn btn-sm btn-outline-secondary mr-3" @click="showOptionCard=false">
              {{ $t('Close') }}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
              {{ $t('Save') }}
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <draggable @update="updateSort" :element="'div'" v-model="optionsList" :options="{group:'options'}" @start="drag=true" @end="drag=false" >
            <div v-for="(option, index) in optionsList" :key="option.value">
              <div v-if="removeIndex === index">
                <div class="card mb-3 bg-danger text-white text-right">
                  <div class="card-body">
                    {{ currentItemToDelete }}
                  </div>
                  <div class="card-footer ">
                    <button type="button" class="btn btn-sm  bg-white mr-3" @click="removeIndex=null">
                      {{ $t('Close') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteOption()">
                      {{ $t('Yes') }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="editIndex === index">
                <div class="card">
                  <div class="card-header pl-2" v-if="optionCardType == 'insert'">
                    {{ $t('Add Option') }}
                  </div>
                  <div v-else class="card-header">
                    {{ $t('Edit Option') }}
                  </div>
                  <div class="card-body p-2">
                    <label for="option-value">{{ $t('Key') }}</label>
                    <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />
                    <div v-if="optionError" class="invalid-feedback d-block text-right">
                      <div>{{ optionError }}</div>
                    </div>
                    <label class="mt-3" for="option-content">{{ $t('Value') }}</label>
                    <b-form-input id="option-content" v-model="optionContent"/>

                    <div class="card-footer pr-1 mt-3 text-right">
                      <button type="button" class="btn btn-sm btn-outline-secondary mr-3" @click="editIndex=null">
                        {{ $t('Close') }}
                      </button>
                      <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
                        {{ $t('Save') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="row" :class="rowCss(index)">
                <div class="col-1">
                  <span class="fas fa-arrows-alt-v"/>
                </div>
                <div class="col-1">
                  <input type="radio" class="form-check" name="defaultOptionGroup" v-model="defaultOptionKey" :value="option[keyField]">
                </div>
                <div class="col-5">
                  {{ option[valueField] }}
                </div>
                <div class="col-1">
                  <a @click="showEditOption(index)" class="fas fa-cog"/>
                </div>
                <div class="col-1">
                  <a @click="removeOption(index)" class="fas fa-trash-alt"/>
                </div>
              </div>
            </div>
          </draggable> 
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <a @click="editAsJson()" href="#">
            <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{ $t('Edit as JSON') }}</small>
          </a>
        </div>
      </div>
    </div>


    <div v-if="showJsonEditor && dataSource === dataSourceValues.provideData">
      <div v-if="dataSource === dataSourceValues.provideData">
        <label for="json-data">{{ $t('JSON Data') }}</label>
        <b-form-textarea class="mb-3" :class="jsonDataClass" id="json-data" rows="8" v-model="jsonData" @change="jsonDataChange"/>
      </div>

      <div v-if="jsonError" class="invalid-feedback d-block text-right">
        <div>{{ jsonError }}</div>
      </div>

      <a @click="editAsOptionList()" href="#" class="text-right">
        <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{ $t('Edit as Option List') }}</small>
      </a>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="data-name">{{ $t('Data Name') }}</label>
      <b-form-input id="data-name" v-model="dataName"/>
      <small class="form-text text-muted mb-3">{{ $t('Data source to populate select') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject || showJsonEditor">
      <label for="key">{{ $t('Key') }}</label>
      <b-form-input id="key" v-model="key" @change="keyChanged"/>
      <small class="form-text text-muted mb-3">{{ $t('Field to save to the data object') }}</small>

      <label for="value">{{ $t('Value') }}</label>
      <b-form-input id="value" v-model="value" @change="valueChanged"/>
      <small class="form-text text-muted mb-3">{{ $t('Field to show in the select box') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="pmql-query">{{ $t('PMQL') }}</label>
      <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
      <small class="form-text text-muted">Advanced data search</small>
    </div>
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
      jsonError: '',
      optionError:'',
      dragging: false,
      dataSourceValues,
      dataSources,
      dataSource: dataSourceValues.provideData,
      jsonData: '',
      key: null,
      value: null,
      dataName: '',
      pmqlQuery: '',
      optionsList: [],
      showOptionCard: false,
      showRemoveWarning: false,
      showJsonEditor: false,
      optionCardType: '',
      editIndex: null,
      removeIndex: null,
      optionValue: '',
      optionContent: '',
      defaultOptionKey: false,
      selectedOptions: [],
    };
  },
  watch: {
    options() {
      this.dataSource = this.options.dataSource;
      this.jsonData = this.options.jsonData;
      this.dataName = this.options.dataName;
      this.key = this.options.key;
      this.value = this.options.value;
      this.pmqlQuery = this.options.pmqlQuery;
      this.defaultOptionKey = this.options.defaultOptionKey;
      this.selectedOptions = this.options.selectedOptions;
      this.optionsList = this.options.optionsList;
    },
    dataSource() {
      this.jsonData = '';
      this.dataName = '';
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  computed: {
    jsonDataClass() {
      return this.jsonError ? 'is-invalid' : '';
    },
    optionKeyClass() {
      return this.optionError ? 'is-invalid' : '';
    },
    keyField() {
      return this.key || 'key';
    },
    valueField() {
      return this.value || 'value';
    },
    currentItemToDelete() {
      if (this.removeIndex !== null
          && this.optionsList.length > 0
          && this.optionsList[this.removeIndex] !==
          undefined) {
        let itemName =  this.optionsList[this.removeIndex][this.valueField];
        return this.$t('Are you sure you want to delete "{{item}}"?', {item:itemName});
      }
      return '';
    },
    dataObjectOptions() {
      return {
        dataSource: this.dataSource,
        jsonData: this.jsonData,
        dataName: this.dataName,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
        defaultOptionKey: this.defaultOptionKey,
        selectedOptions: this.selectedOptions,
        optionsList: this.optionsList,
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
    this.defaultOptionKey= this.options.defaultOptionKey;
    this.selectedOptions = this.options.selectedOptions;
    this.optionsList = this.options.optionsList ? this.options.optionsList : [];
    this.jsonData = JSON.stringify(this.optionsList);
  },
  methods: {
    rowCss(index) {
      return index % 2 === 0 ? 'bg-default' : 'alert-secondary';
    },
    keyChanged() {
      this.optionsList = [];
    },
    valueChanged() {
      this.optionsList = [];
    },
    jsonDataChange() {
      let jsonList = [];
      try {
        jsonList = JSON.parse(this.jsonData);
        if (jsonList.constructor !== Array && jsonList.constructor !== Object) {
          throw Error('String does not represent a valid JSON');
        }
      }
      catch (err) {
        this.jsonError = err.message;
        return;
      }

      this.optionsList = [];
      const that = this;
      jsonList.forEach (item => {
        that.optionsList.push({
          [that.keyField] : item[that.keyField], 
          [that.valueField] : item[that.valueField],
        });
      });
      this.jsonError = '';
    },
    updateSort() {
      this.jsonData = JSON.stringify(this.optionsList);
      this.$emit('change', this.dataObjectOptions);
      
    },
    editAsJson() {
      this.showJsonEditor = true;
    },
    editAsOptionList() {
      this.showJsonEditor = false;
    },
    showEditOption(index) {
      this.optionCardType = 'edit';
      this.editIndex = index;
      this.optionContent = this.optionsList[index][this.valueField];
      this.optionValue = this.optionsList[index][this.keyField];
      this.optionError = '';
    },
    showAddOption() {
      this.optionCardType = 'insert';
      this.optionContent = '';
      this.optionValue = '';
      this.showOptionCard = true;
      this.optionError = '';
      this.editIndex = null;
    },
    addOption() {
      const that = this;

      if (this.optionCardType === 'insert') {
        if (this.optionsList.find(item => { return item[that.keyField] === this.optionValue; })) {
          this.optionError = 'An item with the same key already exists';
          return;
        } 
        this.optionsList.push(
          {
            [this.valueField]: this.optionContent,
            [this.keyField]: this.optionValue,
          }
        );
      }
      else {
        if (this.optionsList.find((item, index) => { return item[that.keyField] === this.optionValue && index !== this.editIndex ; })) {
          this.optionError = 'An item with the same key already exists';
          return;
        } 
        this.optionsList[this.editIndex][this.keyField] = this.optionValue;
        this.optionsList[this.editIndex][this.valueField] = this.optionContent;
      }

      this.jsonError = '';
      this.jsonData = JSON.stringify(this.optionsList);
      this.showOptionCard = false;
      this.optionError = '';
      this.editIndex = null;
    },

    deleteOption() {
      this.optionsList.splice(this.removeIndex, 1);
      this.jsonData = JSON.stringify(this.optionsList);
      this.showRemoveWarning = false;
      this.removeIndex = null;
    },

    removeOption(index) {
      this.removeIndex = index;
      this.showRemoveWarning = true;
    },
  },
};
</script>
