<template>
  <div>
    <label for="data-sources">{{ $t('Source Type') }}</label>
    <b-form-select id="data-sources" v-model="dataSource" :options="dataSources"/>
    <small class="form-text text-muted mb-3">Data source to populate select</small>

    <div id="addOption" class="card" v-show="showOptionCard">
      <div class="card-header" v-if="optionCardType == 'insert'">
        {{ $t('Add Option') }}
      </div>
      <div v-else class="card-header">
        {{ $t('Edit Option') }}
      </div>
      <div class="card-body">
        <label for="option-value">{{ $t('Value') }}</label>
        <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />

        <div v-if="optionError" class="invalid-feedback d-block text-right">
          <div>{{optionError}}</div>
        </div>

        <label for="option-content">{{ $t('Content') }}</label>
        <b-form-input id="option-content" v-model="optionContent"/>
        <div class="card-footer">
          <button type="button" class="btn btn-sm btn-outline-secondary mr-3" @click="showOptionCard=false">
            {{ $t('Close') }}
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
            {{ $t('Save') }}
          </button>
        </div>
      </div>
    </div>

    <div id="removeOption" class="card text-white bg-danger mb-3" v-show="showRemoveWarning">

      <div class="card-body">
          {{ currentItemToDelete }}
      </div>
      <div class="card-footer">
        <button type="button" class="btn btn-sm btn-outline-secondary mr-3" @click="showRemoveWarning=false">
            {{ $t('Close') }}
        </button>
        <button type="button" class="btn btn-sm btn-secondary" @click="deleteOption()">
            {{ $t('Yes') }}
        </button>
      </div>
    </div>

    <div class="container" v-if="!showJsonEditor &&  dataSource === dataSourceValues.provideData" style="margin-left:-12px;">
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
          <table class="table table-sm table-striped">
            <draggable 
              @update="updateSort"
              :element="'tbody'"
              v-model="existingOptions"
              :options="{group:'options'}"
              @start="drag=true"
              @end="drag=false"
            >
              <tr v-for="(option, index) in existingOptions" :key="option.value">
                <td style="width:10%;">
                  <span class="fas fa-arrows-alt-v"/>
                </td>
                <td style="width:10%;">
                  <input type="radio" class="form-check" name="defaultOptionGroup" v-model="defaultOption" :value="option[keyField]">
                </td>
                <td style="width:50%;">
                  {{ option[valueField] }}
                </td>
                <td style="width:10%;">
                  <a @click="showEditOption(index)" class="fas fa-cog"/>
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
              <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{$t('Edit as JSON')}}</small>
          </a>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <label for="render-as">{{ $t('Render Options As') }}</label>
          <b-form-select id="render-as" v-model="renderAs" :options="renderAsOptions"/>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12">
          <input type="checkbox"  v-model="allowMultiSelect">
          Allow multiple selections
        </div>
      </div>
    </div>

    <b-modal  @ok="addOption" id="addOptionModal" title="Add New Option">
      <form-input label="Option Value" />
      <form-input label="Option Label" />
    </b-modal>

    <div v-if="showJsonEditor && dataSource === dataSourceValues.provideData">
    <!--<div>-->
      <div v-if="dataSource === dataSourceValues.provideData">
        <label for="json-data">{{ $t('JSON Data') }}</label>
        <b-form-textarea class="mb-3" :class="jsonDataClass" id="json-data" rows="8" v-model="jsonData" @change="jsonDataChange"/>
      </div>

      <div v-if="jsonError" class="invalid-feedback d-block text-right">
        <div>{{jsonError}}</div>
      </div>

      <a @click="editAsOptionList()" href="#" class="text-right">
          <small class="form-text text-muted mb-3"><b>&#x3C;/&#x3E;</b> {{$t('Edit as Option List')}}</small>
      </a>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject">
      <label for="data-name">{{ $t('Data Name') }}</label>
      <b-form-input id="data-name" v-model="dataName"/>
          <small class="form-text text-muted mb-3">{{$t('Data source to populate select')}}</small>
    </div>

    <div v-if="dataSource === dataSourceValues.dataObject || showJsonEditor">
    <!--<div>-->
      <label for="key">{{ $t('Key') }}</label>
      <b-form-input id="key" v-model="key" @change="keyChanged"/>
          <small class="form-text text-muted mb-3">{{$t('Field to save to the data object')}}</small>

      <label for="value">{{ $t('Value') }}</label>
      <b-form-input id="value" v-model="value" @change="valueChanged"/>
          <small class="form-text text-muted mb-3">{{$t('Field to show in the select box')}}</small>
    </div>

<!--    <label for="pmql-query">{{ $t('PMQL') }}</label>-->
<!--    <b-form-textarea id="json-data" rows="4" v-model="pmqlQuery"/>-->
<!--    <small class="form-text text-muted">Advanced data search</small>-->
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
       list: [
        { id: 1, name: "Abby", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
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
      existingOptions: [],
      showOptionCard: false,
      showRemoveWarning: false,
      showJsonEditor: false,
      optionCardType: '',
      editIndex: null,
      removeIndex: null,
      optionValue: '',
      optionContent: '',
      renderAs: 'dropdown',
      allowMultiSelect: false,
      defaultOption: '',
      selectedOptions: [],
      renderAsOptions: [
        {
          text:'Dropdown' ,
          value: 'dropdown',
        },
        {
          text: 'Checkbox Group',
          value: 'checkbox',
        }
      ],
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
      this.renderAs = this.options.renderAs;
      this.allowMultiSelect = this.options.allowMultiSelect;
      this.defaultOption = this.options.defaultOption;
      this.selectedOptions = this.options.selectedOptions;
      this.existingOptions = this.options.existingOptions;
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
    jsonDataClass () {
      return this.jsonError ? 'is-invalid' : '';
    },
    optionKeyClass () {
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
          && this.existingOptions.length > 0
          && this.existingOptions[this.removeIndex] !==
          undefined) {
        let itemName =  this.existingOptions[this.removeIndex][this.valueField];
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
        renderAs: this.renderAs,
        allowMultiSelect: this.allowMultiSelect,
        defaultOption: this.defaultOption,
        selectedOptions: this.selectedOptions,
        existingOptions: this.existingOptions,
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
     this.renderAs = this.options.renderAs;
     this.allowMultiSelect = this.options.allowMultiSelect;
     this.defaultOption= this.options.defaultOption;
     this.selectedOptions = this.options.selectedOptions;
     this.existingOptions = this.options.existingOptions ? this.options.existingOptions : [];
     this.jsonData = JSON.stringify(this.existingOptions);
  },
  methods: {
    keyChanged() {
      this.existingOptions = [];
    },
    valueChanged() {
      this.existingOptions = [];
    },
    jsonDataChange() {
      let jsonList = [];
      let newList = [];
      try {
        jsonList = JSON.parse(this.jsonData);
        if (jsonList.constructor !== Array && jsonList.constructor !== Object) {
          throw Error("String does not represent a valid JSON");
        }
      }
      catch(err) {
        this.jsonError = err.message;
        return;
      }

      this.existingOptions = [];
      const that = this;
      console.log(jsonList);
      jsonList.forEach (item => {
        that.existingOptions.push({
          [that.keyField] : item[that.keyField], 
          [that.valueField] : item[that.valueField]
        });
      });
      this.jsonError = '';
    },
    updateSort() {
      this.jsonData = JSON.stringify(this.existingOptions);
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
      this.showOptionCard = true;
      this.optionContent = this.existingOptions[index][this.valueField]
      this.optionValue = this.existingOptions[index][this.keyField];
      this.optionError = '';
    },
    showAddOption() {
      this.optionCardType = 'insert';
      this.optionContent = '';
      this.optionValue = '';
      this.showOptionCard = true;
      this.optionError = '';
    },
    addOption() {
      const that = this

      if (this.existingOptions.find(item => { return item[that.keyField] === this.optionValue })) {
        this.optionError = 'An item with the same key already exists';
        return;
      } 

      if (this.optionCardType === 'insert') {
        this.existingOptions.push(
          {
            [this.valueField]: this.optionContent,
            [this.keyField]: this.optionValue,
          }
        );
      }
      else {
        this.existingOptions[this.editIndex][this.keyField] = this.optionValue;
        this.existingOptions[this.editIndex][this.valueField] = this.optionContent;
      }

      this.jsonError = '';
      this.jsonData = JSON.stringify(this.existingOptions);
      this.showOptionCard = false;
      this.optionError = '';
    },

    deleteOption() {
      this.existingOptions.splice(this.removeIndex, 1);
      this.jsonData = JSON.stringify(this.existingOptions);
      this.showRemoveWarning = false;
    },

    removeOption(index) {
      this.removeIndex = index;
      this.showRemoveWarning = true;
    },
  },
};
</script>
