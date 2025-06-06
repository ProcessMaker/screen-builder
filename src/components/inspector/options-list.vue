<template>
  <div>
    <label for="data-sources">{{ $t('Data Source') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSourceTypes" class="mb-3" data-cy="inspector-data-sources" />

    <div v-if="!showJsonEditor && dataSource === dataSourceValues.provideData">
      <div class="row">
        <div class="col-10">
          <label for="data-sources"><b>{{ $t('Options') }}</b></label>
        </div>
        <div class="col-2">
          <a @click="showAddOption" class="fas fa-plus-square" data-cy="inspector-add-option" />
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
          <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" data-cy="inspector-option-value" />
          <div v-if="optionError" class="invalid-feedback d-block text-right">
            <div>{{ optionError }}</div>
          </div>
          <label class="mt-3" for="option-content">{{ $t('Content') }}</label>
          <b-form-input id="option-content" v-model="optionContent" data-cy="inspector-option-content" />

          <label v-if="renderAs === 'checkbox'" class="mt-3" for="option-aria-label">{{ $t('Aria Label') }}</label>
          <b-form-input v-if="renderAs === 'checkbox'" id="option-aria-label" v-model="optionAriaLabel" data-cy="inspector-option-aria-label" />
        </div>

        <div class="card-footer text-right p-2">
          <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="showOptionCard=false" data-cy="inspector-option-cancel">
            {{ $t('Cancel') }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()" data-cy="inspector-option-save">
            {{ $t('Save') }}
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <draggable @update="updateSort" :element="'div'" v-model="optionsList" group="options" @start="drag=true" @end="drag=false" >
            <div v-for="(option, index) in optionsList" :key="option.value">
              <div v-if="removeIndex === index">
                <div class="card mb-3 bg-danger text-white text-left mt-2">
                  <div class="card-body p-2" v-html="currentItemToDelete"/>
                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-light mr-2" @click="removeIndex=null" data-cy="inspector-options-remove-cancel">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteOption()" data-cy="inspector-options-remove-confirm">
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
                    <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" data-cy="inspector-option-value" />
                    <div v-if="optionError" class="invalid-feedback d-block text-right">
                      <div>{{ optionError }}</div>
                    </div>
                    <label class="mt-3" for="option-content">{{ $t('Content') }}</label>
                    <b-form-input id="option-content" v-model="optionContent" data-cy="inspector-option-content" />
                    
                    <label v-if="renderAs === 'checkbox'" class="mt-3" for="option-aria-label">{{ $t('Aria Label') }}</label>
                    <b-form-input v-if="renderAs === 'checkbox'" id="option-aria-label" v-model="optionAriaLabel" data-cy="inspector-option-aria-label" />
                  </div>

                  <div class="card-footer text-right p-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary mr-2" @click="editIndex=null">
                      {{ $t('Cancel') }}
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" @click="addOption()" data-cy="inspector-option-save">
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
                  <a @click="showEditOption(index)" class="fas fa-cog" style="cursor:pointer" data-cy="inspector-options-edit"/>
                </div>
                <div class="col-1">
                  <a @click="removeOption(index)" class="fas fa-trash-alt" style="cursor:pointer" data-cy="inspector-options-remove" />
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
      <div class="row">
        <div class="col text-right">
          <button type="button" @click="showJsonEditor = true" class="edit-json text-muted mt-1 mb-3" data-cy="inspector-edit-json">
            <i class="fas fa-code" aria-hidden="true"/>
            {{ $t('Edit as JSON') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="dataSource === dataSourceValues.dataObject || dataSource === dataSourceValues.dataConnector">
      <label for="element-name">{{ $t('Options Variable') }}</label>
      <mustache-helper/>
      <b-form-input id="element-name" v-model="dataName" placeholder="Request Variable Name" data-cy="inspector-options-variable" />
      <small class="form-text text-muted mb-3">{{ $t('Get options from this variable. Must be an array.') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="value">{{ $t('Option Label Shown') }}</label>
      <b-form-input id="value" v-model="value" placeholder="Request Variable Property" @change="valueChanged" data-cy="inspector-options-label" />
      <small class="form-text text-muted mb-3">{{ $t('Enter the property name from the Request data variable that displays to the user on the screen.') }}</small>
    </div>
    
    <div v-if="dataSource === dataSourceValues.collection">
      <collection-select-list v-model="collectionOptions" :renderAs="renderAs" exclude-collection-type="RAG"></collection-select-list>
    </div>

    <div v-if="showRenderAs">
      <div class="row mb-3">
        <div class="col">
          <label for="render-as">{{ $t('Show Control As') }}</label>
          <b-form-select id="render-as" v-model="renderAs" :options="renderAsOptions" data-cy="inspector-render-as" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12">
          <input type="checkbox"  v-model="allowMultiSelect" data-cy="inspector-allow-multi-select">
          {{ $t('Allow Multiple Selections') }}
        </div>
      </div>
    </div>
    <div v-if="showJsonEditor && dataSource === dataSourceValues.provideData">
      <div class="mb-2">
        <label for="json-data">{{ $t('JSON Data') }}</label>
        <button type="button" @click="expandEditor" class="btn-sm float-right" data-cy="inspector-monaco-json-expand"><i class="fas fa-expand"/></button>
      </div>
      <div class="small-editor-container">
        <monaco-editor
          :options="monacoOptions"
          class="editor"
          v-model="jsonData"
          language="json"
          @change="jsonDataChange"
          data-cy="inspector-monaco-json"
          @editorDidMount="monacoMounted"
        />
      </div>

      <b-modal v-model="showPopup" size="lg" centered :title="$t('Script Config Editor')" v-cloak>
        <div class="editor-container">
          <monaco-editor :options="monacoLargeOptions" v-model="jsonData" language="json" class="editor"
            @change="jsonDataChange"
            data-cy="inspector-monaco-json-expanded"
          />
        </div>
        <div slot="modal-footer">
          <b-button @click="closePopup" class="btn btn-secondary text-uppercase" data-cy="inspector-monaco-json-expanded-close">
            {{ $t('Close') }}
          </b-button>
        </div>
      </b-modal>

      <button type="button" @click="showJsonEditor = false" class="edit-json text-muted mt-1 mb-3">
        <i class="fas fa-code" aria-hidden="true"/>
        {{ $t('Edit as Option List') }}
      </button>
    </div>

    <div v-if="showTypeOfValueReturned">
      <label for="value-type-returned">{{ $t('Type of Value Returned') }}</label>
      <b-form-select id="value-type-returded" v-model="valueTypeReturned" :options="returnValueOptions" data-cy="inspector-value-returned" />
      <small class="form-text text-muted mb-3">{{ $t("Select 'Single Value' to use parts of the selected object. Select 'Object' to use the entire selected value.") }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataConnector">
      <div v-if="valueTypeReturned === 'single' || valueTypeReturned === 'object' && $attrs['screen-type'] === 'conversational'">
        <label for="key">{{ $t('Value') }}</label>
        <mustache-helper/>
        <b-form-input id="key" v-model="key" @change="keyChanged" data-cy="inspector-datasource-value"/>
        <small class="form-text text-muted mb-3">{{ $t('Key name in the selected object to use as the value of this control. Leave blank to use the entire selected value.') }}</small>
      </div>

      <label for="value">{{ $t('Content') }}</label>
      <mustache-helper/>
      <b-form-input id="value" v-model="value" @change="valueChanged" data-cy="inspector-datasource-content"/>
      <small class="form-text text-muted mb-3">{{ $t('Content to display to the user in the select list.') }}</small>

      <label v-if="renderAs === 'checkbox'" for="aria-label">{{ $t('Aria Label') }}</label>
      <mustache-helper v-if="renderAs === 'checkbox'" />
      <b-form-input v-if="renderAs === 'checkbox'" id="aria-label" v-model="optionAriaLabel" data-cy="inspector-datasource-aria-label"/>
      <small v-if="renderAs === 'checkbox'" class="form-text text-muted mb-3">{{ $t('Aria label for accessibility support.') }}</small>
    </div>

    <div v-if="valueTypeReturned === 'single' && dataSource === dataSourceValues.dataObject">
      <label for="key">{{ $t('Variable Data Property') }}</label>
      <b-form-input id="key" v-model="key" @change="keyChanged" placeholder="Request Variable Property" data-cy="inspector-options-value" />
      <small class="form-text text-muted mb-3">{{ $t('Enter the property name from the Request data variable that will be passed as the value when selected.') }}</small>

      <label v-if="renderAs === 'checkbox'" for="aria-label">{{ $t('Aria Label') }}</label>
      <b-form-input v-if="renderAs === 'checkbox'" id="aria-label" v-model="optionAriaLabel" placeholder="Aria Label Property" data-cy="inspector-options-aria-label" />
      <small v-if="renderAs === 'checkbox'" class="form-text text-muted mb-3">{{ $t('Enter the property name for the aria label from the Request data variable.') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataConnector">
      <label for="data-sources-list">{{ $t('Data Connector') }}</label>
      <b-form-select id="data-sources-list" v-model="selectedDataSource" :options="dataSourcesList" data-cy="inspector-data-connector" :class="!selectedDataSource ? 'is-invalid' : ''"/>
      <div v-if="!selectedDataSource" class="invalid-feedback">{{ $t('An Data Connector must be selected') }}</div>
      <small class="form-text text-muted mb-3">{{ $t('Data Connector to use') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataConnector">
      <label for="endpoint-list">{{ $t('End Point') }}</label>
      <b-form-select id="endpoint-list" v-model="selectedEndPoint" :options="endPointList" data-cy="inspector-endpoint" :class="selectedDataSource && !selectedEndPoint ? 'is-invalid' : ''"/>
      <div v-if="selectedDataSource && !selectedEndPoint" class="invalid-feedback">{{ $t('An Endpoint must be selected') }}</div>
      <small class="form-text text-muted mb-3">{{ $t('Endpoint to populate select') }}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataConnector">
      <pmql-input
        :search-type="'collections_w_mustaches'"
        class="mb-1"
        :input-label="'PMQL'"
        v-model="pmqlQuery"
        :condensed="true"
        :ai-enabled="true"
        :placeholder="$t('PMQL')">
      </pmql-input>
      <small class="form-text text-muted">{{ $t('Advanced data search') }}</small>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import draggable from 'vuedraggable';
import { dataSources, dataSourceValues } from './data-source-types';
import MonacoEditor from 'vue-monaco';
import MustacheHelper from './mustache-helper';
import _ from 'lodash';
import CollectionSelectList from './collection-select-list';

export default {
  components: {
    draggable,
    MonacoEditor,
    MustacheHelper,
    CollectionSelectList,
  },
  props: ['options', 'selectedControl'],
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
      collectionOptions: null,
      selectedDataSource: '',
      dataSourcesList: [],
      selectedEndPoint: '',
      endpoints: {},
      pmqlQuery: '',
      optionsList: [],
      optionsListExtra: [],
      showOptionCard: false,
      showRemoveWarning: false,
      showJsonEditor: false,
      optionCardType: '',
      editIndex: null,
      removeIndex: null,
      optionValue: '',
      optionContent: '',
      optionAriaLabel: '',
      showRenderAs: false,
      renderAs: 'dropdown',
      allowMultiSelect: false,
      defaultOptionKey: false,
      selectedOptions: [],
      renderAsOptions: [
        {
          text: this.$t('Dropdown/Multiselect'),
          value: 'dropdown',
        },
        {
          text: this.$t('Radio/Checkbox Group'),
          value: 'checkbox',
        },
      ],
      monacoOptions: {
        automaticLayout: true,
        fontSize: 8,
        language: 'json',
        formatOnPaste: true,
        formatOnType: true,
      },
      monacoLargeOptions: {
        automaticLayout: true,
      },
      showPopup: false,
      returnValueOptions: [
        {
          text: this.$t('Single Value'),
          value: 'single',
        },
        {
          text: this.$t('Object'),
          value: 'object',
        },
      ],
      valueTypeReturned: '',
    };
  },
  watch: {
    allowMultiSelect(allow) {
      this.selectedControl.config.dataFormat = allow ? 'array' : 'string';
    },
    options(newOptions) {
      Object.keys(newOptions).forEach(key => {
        if (typeof newOptions[key] !== 'undefined') {
          this.$set(this, key, newOptions[key]);
        }
      });
    },
    dataSource(val) {
      this.showRenderAs = true;
      switch (val) {
        case 'dataConnector':
          this.jsonData = '';
          this.dataName = '';
          this.collectionOptions = null;
          this.getDataSourceList();
          break;
        case 'dataObject':
          this.jsonData = '';
          this.selectedDataSource = '';
          this.collectionOptions = null;
          break;
        case 'provideData':
          this.dataName = '';
          this.selectedDataSource = '';
          this.collectionOptions = null;
          break;
        case 'collection':
          this.showRenderAs = false;
          this.renderAs = 'dropdown';
          this.jsonData = '';
          this.dataName = '';
          this.selectedDataSource = '';
          break;
      }
    },
    dataObjectOptions(dataObjectOptions) {
      this.$emit('change', dataObjectOptions);
    },
    dataSourcesList() {
      if (this.dataSourcesList.some(ds => ds.value === this.selectedDataSource)) {
        return;
      }

      if (this.dataSourcesList.length > 0) {
        this.selectedDataSource = this.dataSourcesList[0].value;
      }
    },
    endPointList() {
      if (this.endPointList.some(e => e.value === this.selectedEndPoint)) {
        return;
      }

      if (this.endPointList.length > 0) {
        this.selectedEndPoint = this.endPointList[0].value;
      }
    }
  },
  computed: {
    showTypeOfValueReturned() {
      return this.dataSource !== dataSourceValues.collection
    },
    endPointList() {
      return _.get(this.endpoints, this.selectedDataSource, []);
    },
    dataSourceTypes() {
      if (typeof this.options.allowMultiSelect === 'undefined') {
        return [this.dataSources[0], this.$t(this.dataSources[1])];
      }
      return this.dataSources.map((item) => {
        return {
          value: item.value,
          text: this.$t(item.text),
        };
      });
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
    ariaLabelField() {
      return this.ariaLabel || 'ariaLabel';
    },
    currentItemToDelete() {
      if (this.removeIndex !== null
          && this.optionsList.length > 0
          && this.optionsList[this.removeIndex] !==
          undefined) {
        let itemName =  this.optionsList[this.removeIndex][this.valueField];
        return this.$t('Are you sure you want to delete "{{item}}" option?', {item:itemName});
      }
      return '';
    },
    dataObjectOptions() {
      if (!this.dataName) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dataName = this.options.dataName ? this.options.dataName : 'response';
      }
      return {
        dataSource: this.dataSource,
        jsonData: this.jsonData,
        dataName: this.dataName,
        collectionOptions: this.collectionOptions,
        selectedDataSource: this.selectedDataSource,
        selectedEndPoint: this.selectedEndPoint,
        key: this.key,
        value: this.value,
        pmqlQuery: this.pmqlQuery,
        defaultOptionKey: this.defaultOptionKey,
        selectedOptions: this.selectedOptions,
        optionsList: this.optionsList,
        optionsListExtra: this.optionsListExtra,
        showRenderAs: this.showRenderAs,
        renderAs: this.renderAs,
        allowMultiSelect: this.allowMultiSelect,
        showOptionCard: this.showOptionCard,
        showRemoveWarning: this.showRemoveWarning,
        showJsonEditor: this.showJsonEditor,
        editIndex: this.editIndex,
        removeIndex: this.removeIndex,
        valueTypeReturned: this.valueTypeReturned,
      };
    },
  },
  created() {
    this.onDebouncedPmqlChange = debounce((pmql) => {
      this.onPmqlChange(pmql);
    }, 1500);
  },
  mounted() {
    this.dataSource = this.options.dataSource;
    this.jsonData = this.options.jsonData;
    this.dataName = this.options.dataName;
    this.collectionOptions = this.options.collectionOptions;
    this.selectedDataSource = this.options.selectedDataSource,
    this.selectedEndPoint = this.options.selectedEndPoint,
    this.key = this.options.key;
    this.value = this.options.value;
    this.pmqlQuery = this.options.pmqlQuery;
    this.defaultOptionKey= this.options.defaultOptionKey;
    this.selectedOptions = this.options.selectedOptions;
    this.optionsList = this.options.optionsList ? this.options.optionsList : [];
    this.optionsListExtra = this.options.optionsListExtra ? this.options.optionsListExtra : [];
    this.jsonData = JSON.stringify(this.optionsList);
    this.showRenderAs = this.options.showRenderAs;
    this.renderAs = this.options.renderAs;
    this.allowMultiSelect = this.options.allowMultiSelect;
    this.valueTypeReturned = this.options.valueTypeReturned;
  },
  methods: {
    monacoMounted(editor) {
      editor.getAction('editor.action.formatDocument').run();
    },
    getDataSourceList() {
      this.$dataProvider
        .get('/data_sources')
        .then(response => {
          let jsonData = response.data.data;
          // Map the data sources response to value/text items list
          this.dataSourcesList = [{
            value: null,
            text: this.$t('Select...'),
          }].concat(jsonData.map(this.convertToSelectOptions));
          this.setEndpointList(jsonData);
        });
    },
    setEndpointList(dataSources) {
      const endpoints = {};
      dataSources.forEach(ds => {
        const dsEndpoints = ds.endpoints ? ds.endpoints : [];
        endpoints[ds.id] = [{
          value: null,
          text: this.$t('Select...'),
        }].concat(Object.keys(dsEndpoints).map(name => {
          return { text: name, value: name };
        }));
      });
      this.endpoints = endpoints;
    },
    convertToSelectOptions(option) {
      return {
        value: option['id'],
        text: option['name'],
      };
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
      jsonList.forEach((item) => {
        if (that.renderAs === "checkbox") {
          that.optionsList.push({
            [that.keyField]: item[that.keyField],
            [that.valueField]: item[that.valueField],
            [that.ariaLabelField]: item[that.ariaLabelField]
          });
        } else {
          that.optionsList.push({
            [that.keyField]: item[that.keyField],
            [that.valueField]: item[that.valueField]
          });
        }
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
    showEditOption(index) {
      this.optionCardType = 'edit';
      this.editIndex = index;
      this.optionContent = this.optionsList[index][this.valueField];
      this.optionValue = this.optionsList[index][this.keyField];
      this.optionAriaLabel = "";
      if (this.renderAs === "checkbox") {
        this.optionAriaLabel = this.optionsListExtra[index]
          ? this.optionsListExtra[index][this.ariaLabelField]
          : "";
      }
      this.optionError = '';
    },
    showAddOption() {
      this.optionCardType = 'insert';
      this.optionContent = '';
      this.optionValue = '';
      this.optionAriaLabel = '';
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
        const newOption = {
          [this.valueField]: this.optionContent,
          [this.keyField]: this.optionValue
        };
        if (this.renderAs === "checkbox") {
          const index = this.optionsList.length;
          this.optionsList.push(newOption);
          this.optionsListExtra[index] = {
            ...newOption,
            [this.ariaLabelField]: this.optionAriaLabel
          };
        } else {
          this.optionsList.push(newOption);
        }
      } else {
        if (this.optionsList.find((item, index) => { return item[that.keyField] === this.optionValue && index !== this.editIndex ; })) {
          this.optionError = 'An item with the same key already exists';
          return;
        }
        this.optionsList[this.editIndex][this.keyField] = this.optionValue;
        this.optionsList[this.editIndex][this.valueField] = this.optionContent;
        if (this.renderAs === "checkbox") {
          this.optionsListExtra[this.editIndex] = {
            ...this.optionsList[this.editIndex],
            [this.ariaLabelField]: this.optionAriaLabel
          };
        }
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
    onNLQConversion(pmql) {
      this.pmqlQuery = pmql;
    },
    onPmqlChange(pmql) {
      this.pmqlQuery = pmql;
    }
  }
};
</script>

<style scoped lang="scss">
  .edit-json {
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    width: 100%;
    text-align: right;

    &:hover {
      text-decoration: underline;
    }
  }

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
