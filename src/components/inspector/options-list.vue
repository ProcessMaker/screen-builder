<template>
  <div>
    <label for="data-sources">{{ $t('Data Source') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSourceTypes" class="mb-3"/>

    <div v-if="!showJsonEditor &&  dataSource === dataSourceValues.provideData">
      <div class="row">
        <div class="col-10">
          <label for="data-sources"><b>{{ $t('Options') }}</b></label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square"/>
        </div>
      </div>

      <div class="card mb-2" v-if="showOptionCard">
        <div class="card-header" v-if="optionCardType == 'insert'">
          {{ $t('Add Option') }}
        </div>
        <div v-else class="card-header">
          {{ $t('Edit Option') }}
        </div>
        <div class="card-body p-2">
          <label for="option-value">{{ $t('Value') }}</label>
          <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />
          <div v-if="optionError" class="invalid-feedback d-block text-right">
            <div>{{ optionError }}</div>
          </div>
          <label class="mt-3" for="option-content">{{ $t('Content') }}</label>
          <b-form-input id="option-content" v-model="optionContent"/>
        </div>

        <div class="card-footer text-right p-2">
          <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="showOptionCard=false">
            {{ $t('Cancel') }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
            {{ $t('Save') }}
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <draggable @update="updateSort" :element="'div'" v-model="optionsList" :options="{group:'options'}" @start="drag=true" @end="drag=false" >
            <div v-for="(option, index) in optionsList" :key="option.value">
              <div v-if="removeIndex === index">
                <div class="card mb-3 bg-danger text-white text-right">
                  <div class="card-body p-2">
                    {{ currentItemToDelete }}
                  </div>
                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-light mr-2" @click="removeIndex=null">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteOption()">
                      {{ $t('Delete') }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="editIndex === index">
                <div class="card my-2">
                  <div class="card-header" v-if="optionCardType == 'insert'">
                    {{ $t('Add Option') }}
                  </div>
                  <div v-else class="card-header">
                    {{ $t('Edit Option') }}
                  </div>
                  <div class="card-body p-2">
                    <label for="option-value">{{ $t('Value') }}</label>
                    <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />
                    <div v-if="optionError" class="invalid-feedback d-block text-right">
                      <div>{{ optionError }}</div>
                    </div>
                    <label class="mt-3" for="option-content">{{ $t('Content') }}</label>
                    <b-form-input id="option-content" v-model="optionContent"/>
                  </div>

                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="editIndex=null">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
                      {{ $t('Update') }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="row border-top" :class="rowCss(index)">
                <div class="col-1" style="cursor:grab">
                  <span class="fas fa-arrows-alt-v"/>
                </div>
                <div class="col-1 d-flex align-items-center">
                  <input type="radio" class="form-check" @click="defaultOptionClick" name="defaultOptionGroup" v-model="defaultOptionKey" :value="option[keyField]">
                </div>
                <div class="col-5" style="cursor:grab">
                  {{ option[valueField] }}
                </div>
                <div class="col-1">
                  <a @click="showEditOption(index)" class="fas fa-cog" style="cursor:pointer"/>
                </div>
                <div class="col-1">
                  <a @click="removeOption(index)" class="fas fa-trash-alt" style="cursor:pointer"/>
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
        <div class="mb-2">
          <label for="json-data">{{ $t('JSON Data') }}</label>
          <button type="button" @click="expandEditor" class="btn-sm float-right"><i class="fas fa-expand"/></button>
        </div>
        <div class="small-editor-container">
          <MonacoEditor :options="monacoOptions" class="editor" v-model="jsonData" language="json" @change="jsonDataChange"/>
        </div>

        <b-modal v-model="showPopup" size="lg" centered :title="$t('Script Config Editor')" v-cloak>
          <div class="editor-container">
            <MonacoEditor :options="monacoLargeOptions" v-model="jsonData" language="json" class="editor" @change="jsonDataChange"/>
          </div>
          <div slot="modal-footer">
            <b-button @click="closePopup" class="btn btn-secondary">
              {{ $t('CLOSE') }}
            </b-button>
          </div>
        </b-modal>
      </div>

      <a @click="editAsOptionList()" href="#" class="text-right">
        <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{ $t('Edit as Option List') }}</small>
      </a>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="data-sources-list">{{ $t('Data Source Name') }}</label>
      <b-form-select id="data-sources-list" v-model="selectedDataSource" :options="dataSourcesList" class="mb-3"/>
      <small class="form-text text-muted mb-3">{{ $t('Data source to use') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="endpoint-list">{{ $t('End Point') }}</label>
      <b-form-select id="endpoint-list" v-model="selectedEndPoint" :options="endPointList" class="mb-3"/>
      <small class="form-text text-muted mb-3">{{ $t('Endpoint to populate select') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="element-name">{{ $t('Element Name') }}</label>
      <b-form-input id="element-name" v-model="elementName"/>
      <small class="form-text text-muted mb-3">{{ $t('Element of the response to be used') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject || showJsonEditor">
      <label for="key">{{ $t('Value') }}</label>
      <b-form-input id="key" v-model="key" @change="keyChanged"/>
      <small class="form-text text-muted mb-3">{{ $t('Field to save to the data object') }}</small>

      <label for="value">{{ $t('Content') }}</label>
      <b-form-input id="value" v-model="value" @change="valueChanged"/>
      <small class="form-text text-muted mb-3">{{ $t('Field to show in the select box') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="pmql-query">{{ $t('PMQL') }}</label>
      <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>
      <small class="form-text text-muted">Advanced data search</small>
    </div>

    <div class="row mb-3 mt-3" v-if="showRenderAs">
      <div class="col-12">
        <input type="checkbox"  v-model="allowMultiSelect">
        Allow multiple selections
      </div>
    </div>

    <div class="row mb-3" v-if="showRenderAs">
      <div class="col">
        <label for="render-as">{{ $t('Render Options As') }}</label>
        <b-form-select id="render-as" v-model="renderAs" :options="renderAsOptions"/>
      </div>
    </div>
    
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { dataSources, dataSourceValues } from './data-source-types';
import MonacoEditor from 'vue-monaco';

export default {
  components: {
    draggable,
    MonacoEditor,
  },
  props: ['options'],
  model: {
    prop: 'options',
    event: 'change',
  },
  data() {
    return {
      optionError:'',
      dragging: false,
      dataSourceValues,
      dataSources,
      dataSource: dataSourceValues.provideData,
      jsonData: '',
      key: null,
      value: null,
      dataName: '',
      selectedDataSource: '',
      dataSourcesList: [],
      selectedEndPoint: '',
      endPointList: [],
      elementName: '',
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
      showRenderAs: false,
      renderAs: 'dropdown',
      allowMultiSelect: false,
      defaultOptionKey: false,
      selectedOptions: [],
      renderAsOptions: [
        {
          text:'Dropdown/Multiselect' ,
          value: 'dropdown',
        },
        {
          text: 'Radio/Checkbox Group',
          value: 'checkbox',
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        fontSize: 8,
      },
      monacoLargeOptions: {
        automaticLayout: true,
      },
      showPopup: false,
    };
  },
  watch: {
    options() {
      this.dataSource = this.options.dataSource;
      this.jsonData = this.options.jsonData;
      this.dataName = this.options.dataName;
      this.selectedDataSource = this.options.selectedDataSource;
      this.dataSourcesList = this.options.dataSourcesList;
      this.selectedEndPoint = this.options.selectedEndPoint;
      this.endPointList = this.options.endPointList;
      this.elementName = this.options.elementName;
      this.key = this.options.key;
      this.value = this.options.value;
      this.pmqlQuery = this.options.pmqlQuery;
      this.defaultOptionKey = this.options.defaultOptionKey;
      this.selectedOptions = this.options.selectedOptions;
      this.optionsList = this.options.optionsList;
      this.showRenderAs = this.options.showRenderAs;
      this.renderAs = this.options.renderAs;
      this.allowMultiSelect = this.options.allowMultiSelect;
      this.showOptionCard = this.options.showOptionCard;
      this.showRemoveWarning = this.options.showRemoveWarning;
      this.showJsonEditor = this.options.showJsonEditor;
      this.editIndex = this.options.editIndex;
      this.removeIndex = this.options.removeIndex;
    },
    dataSource(val) {
      if (val === 'dataObject') {
        this.jsonData = '';
        this.getDataSourceList();
      } else {
        this.dataName = '';
        this.selectedDataSource = '';
      }
    },
    selectedDataSource(val) {
      this.getEndPointsList();
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
  },
  computed: {
    dataSourceTypes(val) {
      if (typeof this.options.allowMultiSelect === 'undefined') {
        return [this.dataSources[0]];
      }
      return this.dataSources;
    },
    optionKeyClass() {
      return this.optionError ? 'is-invalid' : '';
    },
    keyField() {
      return this.key || 'value';
    },
    valueField() {
      return this.value || 'content';
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
        selectedDataSource: this.selectedDataSource,
        dataSourcesList: this.dataSourcesList,
        selectedEndPoint: this.selectedEndPoint,
        endPointList: this.endPointList,
        elementName: this.elementName,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
        defaultOptionKey: this.defaultOptionKey,
        selectedOptions: this.selectedOptions,
        optionsList: this.optionsList,
        showRenderAs: this.showRenderAs,
        renderAs: this.renderAs,
        allowMultiSelect: this.allowMultiSelect,
        showOptionCard: this.showOptionCard,
        showRemoveWarning: this.showRemoveWarning,
        showJsonEditor: this.showJsonEditor,
        editIndex: this.editIndex,
        removeIndex: this.removeIndex,
      };
    },
  },
  mounted() {
    this.dataSource = this.options.dataSource;
    this.jsonData = this.options.jsonData;
    this.dataName = this.options.dataName;
    this.selectedDataSource = this.options.selectedDataSource,
    this.dataSourcesList = this.options.dataSourcesList,
    this.selectedEndPoint = this.options.selectedEndPoint,
    this.endPointList = this.options.endPointList,
    this.elementName = this.options.elementName,
    this.key = this.options.key;
    this.value = this.options.value;
    this.pmqlQuery = this.options.pmqlQuery;
    this.defaultOptionKey= this.options.defaultOptionKey;
    this.selectedOptions = this.options.selectedOptions;
    this.optionsList = this.options.optionsList ? this.options.optionsList : [];
    this.jsonData = JSON.stringify(this.optionsList);
    this.showRenderAs = this.options.showRenderAs;
    this.renderAs = this.options.renderAs;
    this.allowMultiSelect = this.options.allowMultiSelect;
  },
  methods: {
    getDataSourceList() {
      //If no ProcessMaker is found, datasources can't be loaded
      if (typeof ProcessMaker === 'undefined') {
        this.dataSourcesList = [];
        return;
      }

      ProcessMaker.apiClient
        .get('/data_sources')
        .then(response => {
          let jsonData = response.data.data;
          const convertToSelectOptions = option => ({
            value: option['id'],
            text: option['name'],
          });
          // Map the data sources response to value/text items list
          this.dataSourcesList = jsonData.map(convertToSelectOptions);
        })
        .catch(err => {
          this.dataSourcesList = [];
        });
    },

    getEndPointsList() {
      //If no ProcessMaker is found, datasources can't be loaded
      if (typeof ProcessMaker === 'undefined'
        || typeof this.selectedDataSource === 'undefined'
        || this.selectedDataSource === '') {
        this.endPointList = [];
        return;
      }

      ProcessMaker.apiClient
        .get('/data_sources/' + this.selectedDataSource)
        .then(response => {
          let jsonData = response.data.endpoints;

          for (var endpoint in jsonData) {
            this.endPointList.push({
              text: endpoint,
              value: endpoint,
            });
          }
        })
        .catch(err => {
          this.endPointList = [];
        });
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
    defaultOptionClick() {
      if (this.defaultOptionKey === event.target.value) {
        this.defaultOptionKey = false;
      }
    },
    rowCss(index) {
      return index % 2 === 0 ? 'striped' : 'bg-default';
    },
    keyChanged() {
      this.jsonDataChange();
    },
    valueChanged() {
      this.jsonDataChange();
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
    expandEditor() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
  },
};
</script>
<style scoped>
  .striped {
    background-color: rgba(0,0,0,.05);
  }

  .small-editor-container .editor {
    width: inherit;
    height: 150px;
  }

  .editor-container {
    height: 70vh;
  }

  .editor-container .editor {
    height: inherit;
  }
</style>
